/* Dữ liệu giả lập Mây; đồng bộ với 3 CSV trong practice. */
const AIM_MARKETING_DATA = {
  "leads": [
    {
      "lead_id": "L01",
      "source": "ads",
      "date": "2026-11-01",
      "status": "qualified"
    },
    {
      "lead_id": "L02",
      "source": "email",
      "date": "2026-11-01",
      "status": "new"
    },
    {
      "lead_id": "L03",
      "source": "ads",
      "date": "2026-11-02",
      "status": "qualified"
    },
    {
      "lead_id": "L04",
      "source": "organic",
      "date": "2026-11-02",
      "status": "lost"
    },
    {
      "lead_id": "L05",
      "source": "email",
      "date": "2026-11-03",
      "status": "qualified"
    },
    {
      "lead_id": "L06",
      "source": "ads",
      "date": "2026-11-03",
      "status": "new"
    },
    {
      "lead_id": "L07",
      "source": "organic",
      "date": "2026-11-04",
      "status": "qualified"
    },
    {
      "lead_id": "L08",
      "source": "email",
      "date": "2026-11-04",
      "status": "lost"
    }
  ],
  "orders": [
    {
      "order_id": "O01",
      "lead_id": "L01",
      "revenue_vnd": 300000
    },
    {
      "order_id": "O02",
      "lead_id": "L01",
      "revenue_vnd": 200000
    },
    {
      "order_id": "O03",
      "lead_id": "L05",
      "revenue_vnd": 400000
    },
    {
      "order_id": "O04",
      "lead_id": "L07",
      "revenue_vnd": 250000
    }
  ],
  "costs": [
    {
      "source": "ads",
      "ad_spend_vnd": 200000,
      "other_acquisition_vnd": 50000
    },
    {
      "source": "email",
      "ad_spend_vnd": 0,
      "other_acquisition_vnd": 60000
    },
    {
      "source": "organic",
      "ad_spend_vnd": 0,
      "other_acquisition_vnd": 90000
    }
  ]
};
if(typeof module!=="undefined"&&module.exports)module.exports=AIM_MARKETING_DATA;
