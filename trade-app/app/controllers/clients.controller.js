const db = require("../models");
const { QueryTypes } = require('sequelize');
const Client = db.client;

exports.create = async (req, res) => {
    try {
        const data = await Client.create(req.body);
        res.status(201).send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findAll = async (_req, res) => {
    try {
        const data = await Client.findAll();
        res.send(data);
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.findOne = async (req, res) => {
    try {
        const item = await Client.findByPk(req.params.id);
        item ? res.send(item) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.update = async (req, res) => {
    try {
        const result = await Client.update(req.body, { where: { id: req.params.id }});
        result[0] ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Client.destroy({ where: { id: req.params.id }});
        result ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

exports.deleteAll = async (_req, res) => {
    try {
        const count = await Client.destroy({ where: {}, truncate: false });
        res.send({ message: `${count} records deleted` });
    } catch (e) { 
        res.status(500).send({ message: e.message }); 
    }
};

// === НЕСТАНДАРТНЫЕ ЗАПРОСЫ ===

// Получить информацию о реферере для клиента
exports.getReferredBy = async (req, res) => {
  try {
    const id = req.params.id;
    
    const result = await db.sequelize.query(
      `SELECT referred_by.* 
       FROM clients referred_by 
       JOIN clients client ON client.referred_by_id = referred_by.id 
       WHERE client.id = ${id}`,
      {
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send({ message: "Referred by information not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Получить информацию о реферере с параметризацией
exports.getReferredByParam = async (req, res) => {
  try {
    const id = req.params.id;
    
    const result = await db.sequelize.query(
      'SELECT referred_by.* FROM clients referred_by ' +
      'JOIN clients client ON client.referred_by_id = referred_by.id ' +
      'WHERE client.id = :clientId',
      {
        replacements: { clientId: id },
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send({ message: "Referred by information not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Получить список рефералов клиента
exports.getReferrals = async (req, res) => {
  try {
    const id = req.params.id;
    
    const referrals = await db.sequelize.query(
      'SELECT referrals.* FROM clients referrals ' +
      'WHERE referrals.referred_by_id = :clientId',
      {
        replacements: { clientId: id },
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    res.send(referrals);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Статистика по рефералам
exports.getReferralStatistics = async (_req, res) => {
  try {
    const statistics = await db.sequelize.query(
      'SELECT referred_by_id, COUNT(*) as referral_count ' +
      'FROM clients ' +
      'WHERE referred_by_id IS NOT NULL ' +
      'GROUP BY referred_by_id ' +
      'ORDER BY referral_count DESC',
      {
        type: QueryTypes.SELECT
      }
    );
    
    const result = await Promise.all(statistics.map(async item => {
      const referrer = await Client.findByPk(item.referred_by_id);
      return {
        referrer_id: item.referred_by_id,
        referrer_name: referrer ? referrer.full_name : 'Unknown',
        referral_count: parseInt(item.referral_count)
      };
    }));
    
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Поиск клиентов по части email
exports.findByEmailPart = async (req, res) => {
  try {
    const emailPart = req.query.email;
    if (!emailPart) {
      return res.status(400).send({ message: "Email part is required" });
    }
    
    const clients = await db.sequelize.query(
      'SELECT * FROM clients WHERE email ILIKE :emailPattern',
      {
        replacements: { emailPattern: `%${emailPart}%` },
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    res.send(clients);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Топ рефереров
exports.getTopReferrers = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    
    const topReferrers = await db.sequelize.query(
      'SELECT c.*, COUNT(r.id) as referral_count ' +
      'FROM clients c ' +
      'LEFT JOIN clients r ON r.referred_by_id = c.id ' +
      'GROUP BY c.id ' +
      'ORDER BY referral_count DESC ' +
      'LIMIT :limit',
      {
        replacements: { limit: limit },
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    res.send(topReferrers);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Поиск клиентов по городу (извлекаем город из адреса)
exports.findByCity = async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).send({ message: "City is required" });
    }
    
    const clients = await db.sequelize.query(
      'SELECT * FROM clients WHERE address ILIKE :cityPattern',
      {
        replacements: { cityPattern: `%${city}%` },
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    res.send(clients);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Клиенты без рефереров (корневые клиенты)
exports.getRootClients = async (_req, res) => {
  try {
    const rootClients = await db.sequelize.query(
      'SELECT * FROM clients WHERE referred_by_id IS NULL',
      {
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    
    res.send(rootClients);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Поиск дубликатов по email
exports.findEmailDuplicates = async (_req, res) => {
  try {
    const duplicates = await db.sequelize.query(
      'SELECT email, COUNT(*) as count ' +
      'FROM clients ' +
      'GROUP BY email ' +
      'HAVING COUNT(*) > 1 ' +
      'ORDER BY count DESC',
      {
        type: QueryTypes.SELECT
      }
    );
    
    res.send(duplicates);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Анализ активности по месяцам
exports.getMonthlyActivity = async (_req, res) => {
  try {
    const activity = await db.sequelize.query(
      'SELECT ' +
      '  EXTRACT(YEAR FROM created_at) as year, ' +
      '  EXTRACT(MONTH FROM created_at) as month, ' +
      '  COUNT(*) as client_count ' +
      'FROM clients ' +
      'GROUP BY year, month ' +
      'ORDER BY year DESC, month DESC',
      {
        type: QueryTypes.SELECT
      }
    );
    
    res.send(activity);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
  exports.getClientsByPhonePart = async (req, res) => {
  try {
    const phonePart = req.query.phone;
    if (!phonePart) return res.status(400).send({ message: "Phone part is required" });
    const clients = await db.sequelize.query(
      'SELECT * FROM clients WHERE phone_number ILIKE :phonePattern',
      {
        replacements: { phonePattern: `%${phonePart}%` },
        type: QueryTypes.SELECT,
        model: Client,
        mapToModel: true
      }
    );
    res.send(clients);
  } catch (e) { res.status(500).send({ message: e.message }); }
};
};