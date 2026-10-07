const pool = require("../../dbconfig/dbconfig");

const MotorCalculationService = {
  // =========================================================
  // ADDONS
  // =========================================================
  getAddons: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    vehicle_age_months,
    idv,
    callback,
  ) => {
    const sql = `
    SELECT
      a.addon_id,
      a.addon_code,
      a.addon_name,

      r.addon_rule_id,
      r.insurance_company_id,
      r.product_id,
      r.policy_type_id,
      r.vehicle_category_id,
      r.vehicle_class_id,

      r.min_vehicle_age_months,
      r.max_vehicle_age_months,

      r.min_idv,
      r.max_idv,

      r.rate_type,
      r.rate_value,

      r.effective_from,
      r.effective_to,

      r.description

    FROM motor_addon_master a

    INNER JOIN motor_addon_rule r
      ON r.addon_id = a.addon_id

    WHERE a.is_active = 1
      AND r.is_active = 1

      AND r.product_id = ?

      AND (
        r.policy_type_id IS NULL
        OR r.policy_type_id = ?
      )

      AND (
        r.vehicle_category_id IS NULL
        OR r.vehicle_category_id = ?
      )

      AND (
        r.vehicle_class_id IS NULL
        OR r.vehicle_class_id = ?
      )

      AND (
        r.insurance_company_id IS NULL
        OR r.insurance_company_id = ?
      )

      AND (
        r.min_vehicle_age_months IS NULL
        OR r.min_vehicle_age_months <= ?
      )

      AND (
        r.max_vehicle_age_months IS NULL
        OR r.max_vehicle_age_months >= ?
      )

      AND (
        r.min_idv IS NULL
        OR r.min_idv <= ?
      )

      AND (
        r.max_idv IS NULL
        OR r.max_idv >= ?
      )

      AND r.effective_from <= CURDATE()

      AND (
        r.effective_to IS NULL
        OR r.effective_to >= CURDATE()
      )

    ORDER BY a.addon_name ASC
  `;

    const params = [
      Number(product_id),
      Number(policy_type_id),
      Number(vehicle_category_id),
      Number(vehicle_class_id),
      Number(insurance_company_id),
      Number(vehicle_age_months),
      Number(vehicle_age_months),
      Number(idv),
      Number(idv),
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // OD RATE
  // =========================================================
  getODRate: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    fuel_type_id,
    usage_id,
    callback,
  ) => {
    const sql = `
      SELECT
        od_rate_id,

        insurance_company_id,
        product_id,
        policy_type_id,

        vehicle_category_id,
        vehicle_class_id,
        fuel_type_id,
        usage_id,

        rate_type,
        rate_value,

        effective_from,
        effective_to,

        description

      FROM motor_od_rate_master

      WHERE is_active = 1

        AND product_id = ?
        AND policy_type_id = ?

        AND (
          insurance_company_id IS NULL
          OR insurance_company_id = ?
        )

        AND (
          vehicle_category_id IS NULL
          OR vehicle_category_id = ?
        )

        AND (
          vehicle_class_id IS NULL
          OR vehicle_class_id = ?
        )

        AND (
          fuel_type_id IS NULL
          OR fuel_type_id = ?
        )

        AND (
          usage_id IS NULL
          OR usage_id = ?
        )

        AND effective_from <= CURDATE()

        AND (
          effective_to IS NULL
          OR effective_to >= CURDATE()
        )

      ORDER BY
        insurance_company_id IS NOT NULL DESC,
        vehicle_class_id IS NOT NULL DESC,
        vehicle_category_id IS NOT NULL DESC,
        fuel_type_id IS NOT NULL DESC,
        usage_id IS NOT NULL DESC
    `;

    const params = [
      product_id,
      policy_type_id,
      insurance_company_id,
      vehicle_category_id,
      vehicle_class_id,
      fuel_type_id,
      usage_id,
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // OD AGE SLAB
  // =========================================================
  getODAgeSlab: (vehicle_age_months, callback) => {
    const sql = `
      SELECT
        od_age_slab_id,
        slab_code,
        slab_name,
        min_age_months,
        max_age_months,
        od_rate_adjustment_type,
        od_rate_adjustment,
        description

      FROM motor_od_age_slab

      WHERE is_active = 1

        AND min_age_months <= ?

        AND (
          max_age_months IS NULL
          OR max_age_months >= ?
        )

      ORDER BY min_age_months ASC
    `;

    pool.query(sql, [vehicle_age_months, vehicle_age_months], callback);
  },

  // =========================================================
  // OD DEPRECIATION
  // =========================================================
  getODDepreciation: (
    product_id,
    policy_type_id,
    vehicle_age_months,
    callback,
  ) => {
    const sql = `
      SELECT
        depreciation_id,

        product_id,
        policy_type_id,

        min_age_months,
        max_age_months,

        depreciation_percentage,

        effective_from,
        effective_to,

        description

      FROM motor_od_depreciation_master

      WHERE is_active = 1

        AND product_id = ?

        AND (
          policy_type_id IS NULL
          OR policy_type_id = ?
        )

        AND min_age_months <= ?

        AND (
          max_age_months IS NULL
          OR max_age_months >= ?
        )

        AND effective_from <= CURDATE()

        AND (
          effective_to IS NULL
          OR effective_to >= CURDATE()
        )

      ORDER BY
        policy_type_id IS NOT NULL DESC,
        min_age_months DESC
    `;

    pool.query(
      sql,
      [product_id, policy_type_id, vehicle_age_months, vehicle_age_months],
      callback,
    );
  },

  // =========================================================
  // TP RATE + TP SLAB
  // =========================================================
  getTPRate: (
    insurance_company_id,
    product_id,
    policy_type_id,
    policy_term_id,
    vehicle_category_id,
    vehicle_class_id,
    usage_id,
    engine_cc,
    gvw,
    seating_capacity,
    callback,
  ) => {
    const sql = `
    SELECT
      r.tp_rate_id,

      r.insurance_company_id,
      r.product_id,
      r.policy_type_id,
      r.policy_term_id,

      r.vehicle_category_id,
      r.vehicle_class_id,
      r.usage_id,

      r.rate_type,

      r.effective_from,
      r.effective_to,

      r.description,

      s.tp_rate_slab_id,

      s.engine_cc_slab_id,
      ecs.slab_code AS engine_cc_slab_code,
      ecs.slab_name AS engine_cc_slab_name,
      ecs.min_cc,
      ecs.max_cc,

      s.gvw_slab_id,
      gs.slab_code AS gvw_slab_code,
      gs.slab_name AS gvw_slab_name,
      gs.min_gvw,
      gs.max_gvw,

      s.min_seating_capacity,
      s.max_seating_capacity,

      s.rate_value

    FROM motor_tp_rate_master r

    INNER JOIN motor_tp_rate_slab s
      ON s.tp_rate_id = r.tp_rate_id
      AND s.is_active = 1

    LEFT JOIN motor_engine_cc_slabs ecs
      ON ecs.engine_cc_slab_id = s.engine_cc_slab_id
      AND ecs.is_active = 1

    LEFT JOIN motor_gvw_slabs gs
      ON gs.gvw_slab_id = s.gvw_slab_id
      AND gs.is_active = 1

    WHERE r.is_active = 1

      AND r.product_id = ?
      AND r.policy_type_id = ?

      AND (
        r.policy_term_id IS NULL
        OR r.policy_term_id = ?
      )

      AND (
        r.insurance_company_id IS NULL
        OR r.insurance_company_id = ?
      )

      AND (
        r.vehicle_category_id IS NULL
        OR r.vehicle_category_id = ?
      )

      AND (
        r.vehicle_class_id IS NULL
        OR r.vehicle_class_id = ?
      )

      AND (
        r.usage_id IS NULL
        OR r.usage_id = ?
      )

      AND r.effective_from <= CURDATE()

      AND (
        r.effective_to IS NULL
        OR r.effective_to >= CURDATE()
      )

      /* ENGINE CC */
      AND (
        s.engine_cc_slab_id IS NULL

        OR (
          ? IS NOT NULL
          AND ? <> ''
          AND ecs.min_cc <= CAST(? AS DECIMAL(12,2))
          AND (
            ecs.max_cc IS NULL
            OR ecs.max_cc >= CAST(? AS DECIMAL(12,2))
          )
        )
      )

      /* GVW */
      AND (
        s.gvw_slab_id IS NULL

        OR (
          ? IS NOT NULL
          AND ? <> ''
          AND gs.min_gvw <= CAST(? AS DECIMAL(12,2))
          AND (
            gs.max_gvw IS NULL
            OR gs.max_gvw >= CAST(? AS DECIMAL(12,2))
          )
        )
      )

      /* SEATING CAPACITY */
      AND (
        (
          s.min_seating_capacity IS NULL
          AND s.max_seating_capacity IS NULL
        )

        OR (
          ? IS NOT NULL
          AND ? <> ''
          AND (
            s.min_seating_capacity IS NULL
            OR CAST(? AS DECIMAL(12,2)) >= s.min_seating_capacity
          )
          AND (
            s.max_seating_capacity IS NULL
            OR CAST(? AS DECIMAL(12,2)) <= s.max_seating_capacity
          )
        )
      )

    ORDER BY
      r.insurance_company_id IS NOT NULL DESC,
      r.vehicle_class_id IS NOT NULL DESC,
      r.vehicle_category_id IS NOT NULL DESC,
      r.policy_term_id IS NOT NULL DESC
  `;

    const params = [
      Number(product_id),
      Number(policy_type_id),

      Number(policy_term_id),

      Number(insurance_company_id),
      Number(vehicle_category_id),
      Number(vehicle_class_id),
      usage_id ? Number(usage_id) : null,

      // ENGINE CC
      engine_cc,
      engine_cc,
      engine_cc,
      engine_cc,

      // GVW
      gvw || null,
      gvw || null,
      gvw || null,
      gvw || null,

      // SEATING
      seating_capacity || null,
      seating_capacity || null,
      seating_capacity || null,
      seating_capacity || null,
    ];

    pool.query(sql, params, callback);
  },
  // =========================================================
  // NCB RULE
  // =========================================================
  getNCBRule: (
    product_id,
    policy_type_id,
    previous_ncb_percentage,
    previous_year_claim,
    callback,
  ) => {
    const sql = `
    SELECT
      ncb_rule_id,

      product_id,
      policy_type_id,

      min_policy_years,
      max_policy_years,

      claim_free_required,
      ncb_percentage,

      effective_from,
      effective_to,

      description

    FROM motor_ncb_rule_master

    WHERE is_active = 1

      AND product_id = ?

      AND (
        policy_type_id IS NULL
        OR policy_type_id = ?
      )

      AND effective_from <= CURDATE()

      AND (
        effective_to IS NULL
        OR effective_to >= CURDATE()
      )

    ORDER BY
      policy_type_id IS NOT NULL DESC,
      min_policy_years ASC
  `;

    pool.query(sql, [product_id, policy_type_id], (err, rows) => {
      if (err) {
        return callback(err);
      }

      if (!rows || rows.length === 0) {
        return callback(null, []);
      }

      const previousNCB = Number(previous_ncb_percentage) || 0;
      const claim = String(previous_year_claim || "").toUpperCase();

      /*
       * CLAIM
       * If customer had a claim in previous policy,
       * NCB becomes 0%.
       */
      if (claim === "Y") {
        return callback(null, [
          {
            ...rows[0],
            ncb_percentage: 0,
            calculated_ncb_percentage: 0,
            previous_ncb_percentage: previousNCB,
            previous_year_claim: claim,
            description: "NCB reset due to previous year claim.",
          },
        ]);
      }

      /*
       * NO CLAIM
       * Find the next NCB slab after the previous NCB.
       */
      const sortedRows = [...rows].sort(
        (a, b) => Number(a.ncb_percentage) - Number(b.ncb_percentage),
      );

      const nextRule = sortedRows.find(
        (rule) => Number(rule.ncb_percentage) > previousNCB,
      );

      /*
       * If already at maximum NCB,
       * retain the previous NCB.
       */
      const applicableRule = nextRule || sortedRows[sortedRows.length - 1];

      return callback(null, [
        {
          ...applicableRule,
          calculated_ncb_percentage: Number(applicableRule.ncb_percentage),
          previous_ncb_percentage: previousNCB,
          previous_year_claim: claim,
        },
      ]);
    });
  },

  // =========================================================
  // NCB CLAIM RULE
  // =========================================================
  getNCBClaimRules: (ncb_rule_id, callback) => {
    const sql = `
      SELECT
        ncb_claim_rule_id,
        ncb_rule_id,
        claim_count,
        ncb_percentage,
        description

      FROM motor_ncb_claim_rule

      WHERE ncb_rule_id = ?
        AND is_active = 1

      ORDER BY claim_count ASC
    `;

    pool.query(sql, [ncb_rule_id], callback);
  },

  // =========================================================
  // DISCOUNT RULE
  // =========================================================
  getDiscountRule: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    usage_id,
    vehicle_age_months,
    callback,
  ) => {
    const sql = `
      SELECT
        discount_rule_id,

        insurance_company_id,
        product_id,
        policy_type_id,

        vehicle_category_id,
        vehicle_class_id,
        usage_id,

        discount_type,
        discount_value,

        min_vehicle_age_months,
        max_vehicle_age_months,

        claim_free_required,

        effective_from,
        effective_to,

        description

      FROM motor_discount_rule_master

      WHERE is_active = 1

        AND product_id = ?

        AND (
          insurance_company_id IS NULL
          OR insurance_company_id = ?
        )

        AND (
          policy_type_id IS NULL
          OR policy_type_id = ?
        )

        AND (
          vehicle_category_id IS NULL
          OR vehicle_category_id = ?
        )

        AND (
          vehicle_class_id IS NULL
          OR vehicle_class_id = ?
        )

        AND (
          usage_id IS NULL
          OR usage_id = ?
        )

        AND (
          min_vehicle_age_months IS NULL
          OR ? >= min_vehicle_age_months
        )

        AND (
          max_vehicle_age_months IS NULL
          OR ? <= max_vehicle_age_months
        )

        AND effective_from <= CURDATE()

        AND (
          effective_to IS NULL
          OR effective_to >= CURDATE()
        )

      ORDER BY
        insurance_company_id IS NOT NULL DESC,
        vehicle_class_id IS NOT NULL DESC,
        vehicle_category_id IS NOT NULL DESC
    `;

    const params = [
      product_id,
      insurance_company_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      usage_id,
      vehicle_age_months,
      vehicle_age_months,
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // DISCOUNT CONDITIONS
  // =========================================================
  getDiscountConditions: (discount_rule_ids, callback) => {
    if (!discount_rule_ids.length) {
      return callback(null, []);
    }

    const placeholders = discount_rule_ids.map(() => "?").join(",");

    const sql = `
      SELECT
        discount_condition_id,
        discount_rule_id,
        condition_type,
        condition_operator,
        condition_value,
        description

      FROM motor_discount_condition

      WHERE is_active = 1
        AND discount_rule_id IN (${placeholders})

      ORDER BY discount_rule_id ASC
    `;

    pool.query(sql, discount_rule_ids, callback);
  },

  // =========================================================
  // ZD RATE
  // =========================================================
  //   getZDRate: (
  //     insurance_company_id,
  //     product_id,
  //     policy_type_id,
  //     vehicle_category_id,
  //     vehicle_class_id,
  //     vehicle_age_months,
  //     callback,
  //   ) => {
  //     const sql = `
  //       SELECT
  //         zd_rate_id,

  //         insurance_company_id,
  //         product_id,
  //         policy_type_id,

  //         vehicle_category_id,
  //         vehicle_class_id,

  //         min_age_months,
  //         max_age_months,

  //         rate_type,
  //         rate_value,

  //         effective_from,
  //         effective_to,

  //         description

  //       FROM motor_zd_rate_master

  //       WHERE is_active = 1

  //         AND product_id = ?

  //         AND (
  //           insurance_company_id IS NULL
  //           OR insurance_company_id = ?
  //         )

  //         AND (
  //           policy_type_id IS NULL
  //           OR policy_type_id = ?
  //         )

  //         AND (
  //           vehicle_category_id IS NULL
  //           OR vehicle_category_id = ?
  //         )

  //         AND (
  //           vehicle_class_id IS NULL
  //           OR vehicle_class_id = ?
  //         )

  //         AND (
  //           min_age_months IS NULL
  //           OR ? >= min_age_months
  //         )

  //         AND (
  //           max_age_months IS NULL
  //           OR ? <= max_age_months
  //         )

  //         AND effective_from <= CURDATE()

  //         AND (
  //           effective_to IS NULL
  //           OR effective_to >= CURDATE()
  //         )

  //       ORDER BY
  //         insurance_company_id IS NOT NULL DESC,
  //         vehicle_class_id IS NOT NULL DESC,
  //         vehicle_category_id IS NOT NULL DESC
  //     `;

  //     const params = [
  //       product_id,
  //       insurance_company_id,
  //       policy_type_id,
  //       vehicle_category_id,
  //       vehicle_class_id,
  //       vehicle_age_months,
  //       vehicle_age_months,
  //     ];

  //     pool.query(sql, params, callback);
  //   },

  // =========================================================
  // COVERS
  // =========================================================
  getCovers: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    callback,
  ) => {
    const sql = `
    SELECT
      c.cover_id,
      c.cover_code,
      c.cover_name,
      c.cover_type,

      r.cover_rate_id,

      r.insurance_company_id,
      r.product_id,
      r.policy_type_id,

      r.vehicle_category_id,
      r.vehicle_class_id,

      r.rate_type,
      r.rate_value,

      r.effective_from,
      r.effective_to,

      r.description

    FROM motor_cover_master c

    INNER JOIN motor_cover_rate_master r
      ON r.cover_id = c.cover_id

    WHERE c.is_active = 1
      AND r.is_active = 1

      AND r.product_id = ?

      AND (
        r.insurance_company_id IS NULL
        OR r.insurance_company_id = ?
      )

      AND (
        r.policy_type_id IS NULL
        OR r.policy_type_id = ?
      )

      AND (
        r.vehicle_category_id IS NULL
        OR r.vehicle_category_id = ?
      )

      AND (
        r.vehicle_class_id IS NULL
        OR r.vehicle_class_id = ?
      )

      AND r.effective_from <= CURDATE()

      AND (
        r.effective_to IS NULL
        OR r.effective_to >= CURDATE()
      )

    ORDER BY c.cover_name ASC
  `;

    const params = [
      product_id,
      insurance_company_id ? Number(insurance_company_id) : null,
      policy_type_id ? Number(policy_type_id) : null,
      vehicle_category_id ? Number(vehicle_category_id) : null,
      vehicle_class_id ? Number(vehicle_class_id) : null,
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // COVER UNIT RATES
  // =========================================================
  getCoverUnitRates: (cover_rate_ids, callback) => {
    if (!cover_rate_ids.length) {
      return callback(null, []);
    }

    const placeholders = cover_rate_ids.map(() => "?").join(",");

    const sql = `
      SELECT
        cover_unit_rate_id,
        cover_rate_id,

        min_units,
        max_units,

        rate_per_unit,

        description

      FROM motor_cover_unit_rate

      WHERE is_active = 1
        AND cover_rate_id IN (${placeholders})

      ORDER BY cover_rate_id ASC, min_units ASC
    `;

    pool.query(sql, cover_rate_ids, callback);
  },

  // =========================================================
  // COMMISSION
  // =========================================================
  getCommission: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    callback,
  ) => {
    const sql = `
      SELECT
        commission_rule_id,

        insurance_company_id,
        product_id,
        policy_type_id,

        vehicle_category_id,
        vehicle_class_id,

        commission_type,
        commission_value,

        min_premium,
        max_premium,

        effective_from,
        effective_to,

        description

      FROM motor_commission_rule_master

      WHERE is_active = 1

        AND product_id = ?

        AND (
          insurance_company_id IS NULL
          OR insurance_company_id = ?
        )

        AND (
          policy_type_id IS NULL
          OR policy_type_id = ?
        )

        AND (
          vehicle_category_id IS NULL
          OR vehicle_category_id = ?
        )

        AND (
          vehicle_class_id IS NULL
          OR vehicle_class_id = ?
        )

        AND effective_from <= CURDATE()

        AND (
          effective_to IS NULL
          OR effective_to >= CURDATE()
        )

      ORDER BY
        insurance_company_id IS NOT NULL DESC,
        vehicle_class_id IS NOT NULL DESC,
        vehicle_category_id IS NOT NULL DESC
    `;

    const params = [
      product_id,
      insurance_company_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // CASHBACK
  // =========================================================
  getCashback: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    callback,
  ) => {
    const sql = `
    SELECT
      cashback_rule_id,

      insurance_company_id,
      product_id,
      policy_type_id,

      vehicle_category_id,
      vehicle_class_id,

      cashback_type,
      cashback_value,
      max_cashback_amount,

      min_premium,
      max_premium,

      effective_from,
      effective_to,

      description

    FROM motor_cashback_rule_master

    WHERE is_active = 1

      AND product_id = ?

      AND (
        insurance_company_id IS NULL
        OR insurance_company_id = ?
      )

      AND (
        policy_type_id IS NULL
        OR policy_type_id = ?
      )

      AND (
        vehicle_category_id IS NULL
        OR vehicle_category_id = ?
      )

      AND (
        vehicle_class_id IS NULL
        OR vehicle_class_id = ?
      )

      AND effective_from <= CURDATE()

      AND (
        effective_to IS NULL
        OR effective_to >= CURDATE()
      )

    ORDER BY
      insurance_company_id IS NOT NULL DESC,
      policy_type_id IS NOT NULL DESC,
      vehicle_category_id IS NOT NULL DESC,
      vehicle_class_id IS NOT NULL DESC

    LIMIT 1
  `;

    const params = [
      product_id,
      insurance_company_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // TAX
  // =========================================================
  getTax: (callback) => {
    const sql = `
      SELECT
        tax_id,
        tax_code,
        tax_name,
        tax_type,
        tax_percentage,
        effective_from,
        effective_to,
        description

      FROM motor_tax_master

      WHERE is_active = 1

        AND effective_from <= CURDATE()

        AND (
          effective_to IS NULL
          OR effective_to >= CURDATE()
        )

      ORDER BY effective_from DESC
    `;

    pool.query(sql, callback);
  },

  // =========================================================
  // COMPLETE CALCULATION DATA
  // =========================================================
  getCalculationData: (data, callback) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,

      vehicle_category_id,
      vehicle_class_id,

      fuel_type_id,
      usage_id,

      vehicle_age_months,
      idv,

      engine_cc,
      gvw,
      seating_capacity,

      previous_ncb_percentage,
      previous_year_claim,

      policy_term_id,
    } = data;

    const result = {};

    // -------------------------------------------------------
    // OD RATE
    // -------------------------------------------------------
    MotorCalculationService.getODRate(
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      fuel_type_id,
      usage_id,
      (err, odRate) => {
        if (err) return callback(err);

        result.od_rate = odRate;

        // ---------------------------------------------------
        // OD AGE SLAB
        // ---------------------------------------------------
        MotorCalculationService.getODAgeSlab(
          vehicle_age_months,
          (err, odAgeSlab) => {
            if (err) return callback(err);

            result.od_age_slab = odAgeSlab;

            // -----------------------------------------------
            // OD DEPRECIATION
            // -----------------------------------------------
            MotorCalculationService.getODDepreciation(
              product_id,
              policy_type_id,
              vehicle_age_months,
              (err, odDepreciation) => {
                if (err) return callback(err);

                result.od_depreciation = odDepreciation;

                // -------------------------------------------
                // TP RATE
                // -------------------------------------------
                MotorCalculationService.getTPRate(
                  insurance_company_id,
                  product_id,
                  policy_type_id,
                  policy_term_id,
                  vehicle_category_id,
                  vehicle_class_id,
                  usage_id,
                  engine_cc,
                  gvw,
                  seating_capacity,
                  (err, tpRate) => {
                    if (err) return callback(err);

                    result.tp_rate = tpRate;

                    // ---------------------------------------
                    // NCB RULE
                    // ---------------------------------------
                    MotorCalculationService.getNCBRule(
                      product_id,
                      policy_type_id,
                      previous_ncb_percentage,
                      previous_year_claim,
                      (err, ncbRule) => {
                        if (err) return callback(err);

                        result.ncb_rule = ncbRule;

                        // -----------------------------------
                        // DISCOUNT
                        // -----------------------------------
                        MotorCalculationService.getDiscountRule(
                          insurance_company_id,
                          product_id,
                          policy_type_id,
                          vehicle_category_id,
                          vehicle_class_id,
                          usage_id,
                          vehicle_age_months,
                          (err, discountRule) => {
                            if (err) return callback(err);

                            result.discount_rule = discountRule;

                            // -------------------------------
                            // ZD
                            // -------------------------------
                            MotorCalculationService.getAddons(
                              insurance_company_id,
                              product_id,
                              policy_type_id,
                              vehicle_category_id,
                              vehicle_class_id,
                              vehicle_age_months,
                              idv,
                              (err, addons) => {
                                if (err) return callback(err);

                                result.addons = addons;

                                // -----------------------
                                // COVERS
                                // -----------------------
                                MotorCalculationService.getCovers(
                                  insurance_company_id,
                                  product_id,
                                  policy_type_id,
                                  vehicle_category_id,
                                  vehicle_class_id,
                                  (err, covers) => {
                                    if (err) return callback(err);

                                    result.covers = covers;

                                    // -------------------
                                    // COMMISSION
                                    // -------------------
                                    MotorCalculationService.getCommission(
                                      insurance_company_id,
                                      product_id,
                                      policy_type_id,
                                      vehicle_category_id,
                                      vehicle_class_id,
                                      (err, commission) => {
                                        if (err) {
                                          return callback(err);
                                        }

                                        result.commission = commission;

                                        // ---------------
                                        // CASHBACK
                                        // ---------------
                                        MotorCalculationService.getCashback(
                                          insurance_company_id,
                                          product_id,
                                          policy_type_id,
                                          vehicle_category_id,
                                          vehicle_class_id,
                                          (err, cashback) => {
                                            if (err) {
                                              return callback(err);
                                            }

                                            result.cashback = cashback;

                                            // -----------
                                            // TAX
                                            // -----------
                                            MotorCalculationService.getTax(
                                              (err, tax) => {
                                                if (err) {
                                                  return callback(err);
                                                }

                                                result.tax = tax;

                                                callback(null, result);
                                              },
                                            );
                                          },
                                        );
                                      },
                                    );
                                  },
                                );
                              },
                            );
                          },
                        );
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  },
};

module.exports = MotorCalculationService;
