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

      ORDER BY
        r.insurance_company_id IS NOT NULL DESC,
        r.vehicle_class_id IS NOT NULL DESC,
        r.vehicle_category_id IS NOT NULL DESC,
        r.policy_type_id IS NOT NULL DESC,
        a.addon_name ASC
    `;

    const params = [
      Number(product_id),
      Number(policy_type_id),
      Number(vehicle_category_id),
      Number(vehicle_class_id),
      insurance_company_id ? Number(insurance_company_id) : null,
      Number(vehicle_age_months),
      Number(vehicle_age_months),
      Number(idv),
      Number(idv),
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // OD RATE + OD SLAB
  //
  // OD source of truth:
  // motor_od_rate_master
  // motor_od_rate_slab
  //
  // Age is now part of the OD slab itself.
  // No separate OD age adjustment table is used.
  // =========================================================
  getODRate: (
    insurance_company_id,
    product_id,
    policy_type_id,
    vehicle_category_id,
    vehicle_class_id,
    fuel_type_id,
    usage_id,
    vehicle_age_months,
    engine_cc,
    gvw,
    seating_capacity,
    callback,
  ) => {
    const sql = `
      SELECT
        r.od_rate_id,

        r.insurance_company_id,
        r.product_id,
        r.policy_type_id,
        r.vehicle_category_id,
        r.vehicle_class_id,
        r.fuel_type_id,
        r.usage_id,

        r.rate_type,
        r.rate_value AS master_rate_value,

        r.effective_from,
        r.effective_to,
        r.description,

        s.od_rate_slab_id,

        s.engine_cc_slab_id,
        s.gvw_slab_id,

        s.min_seating_capacity,
        s.max_seating_capacity,

        s.min_age_months,
        s.max_age_months,

        s.rate_value AS slab_rate_value,
        s.description AS slab_description,

        ecs.slab_code AS engine_cc_slab_code,
        ecs.slab_name AS engine_cc_slab_name,
        ecs.min_cc,
        ecs.max_cc,

        gvs.slab_code AS gvw_slab_code,
        gvs.slab_name AS gvw_slab_name,
        gvs.min_gvw,
        gvs.max_gvw

      FROM motor_od_rate_master r

      INNER JOIN motor_od_rate_slab s
        ON s.od_rate_id = r.od_rate_id
        AND s.is_active = 1

      LEFT JOIN motor_engine_cc_slabs ecs
        ON ecs.engine_cc_slab_id = s.engine_cc_slab_id
        AND ecs.is_active = 1

      LEFT JOIN motor_gvw_slabs gvs
        ON gvs.gvw_slab_id = s.gvw_slab_id
        AND gvs.is_active = 1

      WHERE r.is_active = 1

        AND r.product_id = ?
        AND r.policy_type_id = ?

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
          r.fuel_type_id IS NULL
          OR r.fuel_type_id = ?
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

        /* =====================================================
           ENGINE CC
           ===================================================== */

        AND (
          s.engine_cc_slab_id IS NULL

          OR (
            ? IS NOT NULL

            AND ecs.min_cc <= CAST(? AS DECIMAL(12,2))

            AND (
              ecs.max_cc IS NULL
              OR ecs.max_cc >= CAST(? AS DECIMAL(12,2))
            )
          )
        )

        /* =====================================================
           GVW
           ===================================================== */

        AND (
          s.gvw_slab_id IS NULL

          OR (
            ? IS NOT NULL

            AND gvs.min_gvw <= CAST(? AS DECIMAL(12,2))

            AND (
              gvs.max_gvw IS NULL
              OR gvs.max_gvw >= CAST(? AS DECIMAL(12,2))
            )
          )
        )

        /* =====================================================
           SEATING CAPACITY
           ===================================================== */

        AND (
          (
            s.min_seating_capacity IS NULL
            AND s.max_seating_capacity IS NULL
          )

          OR (
            ? IS NOT NULL

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

        /* =====================================================
           VEHICLE AGE
           ===================================================== */

        AND (
          (
            s.min_age_months IS NULL
            AND s.max_age_months IS NULL
          )

          OR (
            ? IS NOT NULL

            AND (
              s.min_age_months IS NULL
              OR CAST(? AS DECIMAL(12,2)) >= s.min_age_months
            )

            AND (
              s.max_age_months IS NULL
              OR CAST(? AS DECIMAL(12,2)) <= s.max_age_months
            )
          )
        )

      ORDER BY

        /* =====================================================
           MASTER SPECIFICITY
           ===================================================== */

        r.insurance_company_id IS NOT NULL DESC,
        r.vehicle_category_id IS NOT NULL DESC,
        r.vehicle_class_id IS NOT NULL DESC,
        r.fuel_type_id IS NOT NULL DESC,
        r.usage_id IS NOT NULL DESC,

        /* =====================================================
           SLAB SPECIFICITY

           More dimensions configured = more specific rule.
           ===================================================== */

        (
          (s.engine_cc_slab_id IS NOT NULL)
          +
          (s.gvw_slab_id IS NOT NULL)
          +
          (
            s.min_seating_capacity IS NOT NULL
            OR s.max_seating_capacity IS NOT NULL
          )
          +
          (
            s.min_age_months IS NOT NULL
            OR s.max_age_months IS NOT NULL
          )
        ) DESC,

        /* Individual dimension priority */

        s.engine_cc_slab_id IS NOT NULL DESC,
        s.gvw_slab_id IS NOT NULL DESC,

        (
          s.min_seating_capacity IS NOT NULL
          OR s.max_seating_capacity IS NOT NULL
        ) DESC,

        (
          s.min_age_months IS NOT NULL
          OR s.max_age_months IS NOT NULL
        ) DESC,

        /* Latest rule */

        r.effective_from DESC,

        s.od_rate_slab_id DESC

      LIMIT 1
    `;

    const age =
      vehicle_age_months !== "" &&
      vehicle_age_months !== undefined &&
      vehicle_age_months !== null
        ? Number(vehicle_age_months)
        : null;

    const cc =
      engine_cc !== "" &&
      engine_cc !== undefined &&
      engine_cc !== null
        ? Number(engine_cc)
        : null;

    const vehicleGvw =
      gvw !== "" &&
      gvw !== undefined &&
      gvw !== null
        ? Number(gvw)
        : null;

    const seating =
      seating_capacity !== "" &&
      seating_capacity !== undefined &&
      seating_capacity !== null
        ? Number(seating_capacity)
        : null;

    const params = [
      // =====================================================
      // MASTER
      // =====================================================

      Number(product_id),
      Number(policy_type_id),

      insurance_company_id
        ? Number(insurance_company_id)
        : null,

      vehicle_category_id
        ? Number(vehicle_category_id)
        : null,

      vehicle_class_id
        ? Number(vehicle_class_id)
        : null,

      fuel_type_id
        ? Number(fuel_type_id)
        : null,

      usage_id
        ? Number(usage_id)
        : null,

      // =====================================================
      // ENGINE CC
      // =====================================================

      cc,
      cc,
      cc,

      // =====================================================
      // GVW
      // =====================================================

      vehicleGvw,
      vehicleGvw,
      vehicleGvw,

      // =====================================================
      // SEATING
      // =====================================================

      seating,
      seating,
      seating,

      // =====================================================
      // AGE
      // =====================================================

      age,
      age,
      age,
    ];

    pool.query(sql, params, callback);
  },

  // =========================================================
  // OD DEPRECIATION
  //
  // This is separate from OD RATE selection.
  // It can be used for IDV/depreciation logic.
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
        min_age_months DESC,
        effective_from DESC

      LIMIT 1
    `;

    const age = Number(vehicle_age_months);

    pool.query(
      sql,
      [
        Number(product_id),
        Number(policy_type_id),
        age,
        age,
      ],
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
        r.vehicle_category_id IS NOT NULL DESC,
        r.vehicle_class_id IS NOT NULL DESC,
        r.policy_term_id IS NOT NULL DESC,
        r.usage_id IS NOT NULL DESC,

        s.engine_cc_slab_id IS NOT NULL DESC,
        s.gvw_slab_id IS NOT NULL DESC,

        s.min_seating_capacity IS NOT NULL DESC,
        s.max_seating_capacity IS NOT NULL DESC,

        r.effective_from DESC

      LIMIT 1
    `;

    const params = [
      // MASTER

      Number(product_id),
      Number(policy_type_id),
      Number(policy_term_id),

      insurance_company_id
        ? Number(insurance_company_id)
        : null,

      vehicle_category_id
        ? Number(vehicle_category_id)
        : null,

      vehicle_class_id
        ? Number(vehicle_class_id)
        : null,

      usage_id
        ? Number(usage_id)
        : null,

      // ENGINE CC

      engine_cc !== "" &&
      engine_cc !== undefined &&
      engine_cc !== null
        ? Number(engine_cc)
        : null,

      engine_cc !== "" &&
      engine_cc !== undefined &&
      engine_cc !== null
        ? Number(engine_cc)
        : null,

      engine_cc !== "" &&
      engine_cc !== undefined &&
      engine_cc !== null
        ? Number(engine_cc)
        : null,

      // GVW

      gvw !== "" &&
      gvw !== undefined &&
      gvw !== null
        ? Number(gvw)
        : null,

      gvw !== "" &&
      gvw !== undefined &&
      gvw !== null
        ? Number(gvw)
        : null,

      gvw !== "" &&
      gvw !== undefined &&
      gvw !== null
        ? Number(gvw)
        : null,

      // SEATING

      seating_capacity !== "" &&
      seating_capacity !== undefined &&
      seating_capacity !== null
        ? Number(seating_capacity)
        : null,

      seating_capacity !== "" &&
      seating_capacity !== undefined &&
      seating_capacity !== null
        ? Number(seating_capacity)
        : null,

      seating_capacity !== "" &&
      seating_capacity !== undefined &&
      seating_capacity !== null
        ? Number(seating_capacity)
        : null,
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
        min_policy_years ASC,
        effective_from DESC
    `;

    pool.query(
      sql,
      [
        Number(product_id),
        Number(policy_type_id),
      ],
      (err, rows) => {
        if (err) {
          return callback(err);
        }

        if (!rows || rows.length === 0) {
          return callback(null, []);
        }

        const previousNCB =
          Number(previous_ncb_percentage) || 0;

        const claim = String(
          previous_year_claim || "",
        )
          .trim()
          .toUpperCase();

        // =====================================================
        // CLAIM
        // =====================================================

        if (claim === "Y") {
          return callback(null, [
            {
              ...rows[0],

              ncb_percentage: 0,
              calculated_ncb_percentage: 0,

              previous_ncb_percentage:
                previousNCB,

              previous_year_claim:
                claim,

              description:
                "NCB reset due to previous year claim.",
            },
          ]);
        }

        // =====================================================
        // NO CLAIM
        // =====================================================

        const sortedRows = [...rows].sort(
          (a, b) =>
            Number(a.ncb_percentage) -
            Number(b.ncb_percentage),
        );

        const nextRule = sortedRows.find(
          (rule) =>
            Number(rule.ncb_percentage) >
            previousNCB,
        );

        let applicableRule;

        if (nextRule) {
          applicableRule = nextRule;
        } else {
          const maximumRule =
            sortedRows[
              sortedRows.length - 1
            ];

          if (
            previousNCB >=
            Number(
              maximumRule.ncb_percentage,
            )
          ) {
            applicableRule =
              maximumRule;
          } else {
            applicableRule = {
              ...maximumRule,
              ncb_percentage:
                previousNCB,
            };
          }
        }

        return callback(null, [
          {
            ...applicableRule,

            calculated_ncb_percentage:
              Number(
                applicableRule.ncb_percentage,
              ),

            previous_ncb_percentage:
              previousNCB,

            previous_year_claim:
              claim,
          },
        ]);
      },
    );
  },

  // =========================================================
  // NCB CLAIM RULE
  // =========================================================
  getNCBClaimRules: (
    ncb_rule_id,
    callback,
  ) => {
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

      ORDER BY
        claim_count ASC
    `;

    pool.query(
      sql,
      [Number(ncb_rule_id)],
      callback,
    );
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
        policy_type_id IS NOT NULL DESC,
        vehicle_category_id IS NOT NULL DESC,
        vehicle_class_id IS NOT NULL DESC,
        usage_id IS NOT NULL DESC,
        min_vehicle_age_months IS NOT NULL DESC,
        effective_from DESC

      LIMIT 1
    `;

    const params = [
      Number(product_id),

      insurance_company_id
        ? Number(insurance_company_id)
        : null,

      policy_type_id
        ? Number(policy_type_id)
        : null,

      vehicle_category_id
        ? Number(vehicle_category_id)
        : null,

      vehicle_class_id
        ? Number(vehicle_class_id)
        : null,

      usage_id
        ? Number(usage_id)
        : null,

      Number(vehicle_age_months),
      Number(vehicle_age_months),
    ];

    pool.query(
      sql,
      params,
      callback,
    );
  },

  // =========================================================
  // DISCOUNT CONDITIONS
  // =========================================================
  getDiscountConditions: (
    discount_rule_ids,
    callback,
  ) => {
    if (
      !discount_rule_ids ||
      !discount_rule_ids.length
    ) {
      return callback(null, []);
    }

    const placeholders =
      discount_rule_ids
        .map(() => "?")
        .join(",");

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

      ORDER BY
        discount_rule_id ASC
    `;

    pool.query(
      sql,
      discount_rule_ids,
      callback,
    );
  },

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

      ORDER BY
        c.cover_name ASC
    `;

    const params = [
      Number(product_id),

      insurance_company_id
        ? Number(insurance_company_id)
        : null,

      policy_type_id
        ? Number(policy_type_id)
        : null,

      vehicle_category_id
        ? Number(vehicle_category_id)
        : null,

      vehicle_class_id
        ? Number(vehicle_class_id)
        : null,
    ];

    pool.query(
      sql,
      params,
      callback,
    );
  },

  // =========================================================
  // COVER UNIT RATES
  // =========================================================
  getCoverUnitRates: (
    cover_rate_ids,
    callback,
  ) => {
    if (
      !cover_rate_ids ||
      !cover_rate_ids.length
    ) {
      return callback(null, []);
    }

    const placeholders =
      cover_rate_ids
        .map(() => "?")
        .join(",");

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

      ORDER BY
        cover_rate_id ASC,
        min_units ASC
    `;

    pool.query(
      sql,
      cover_rate_ids,
      callback,
    );
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
        policy_type_id IS NOT NULL DESC,
        vehicle_category_id IS NOT NULL DESC,
        vehicle_class_id IS NOT NULL DESC,
        effective_from DESC

      LIMIT 1
    `;

    const params = [
      Number(product_id),

      insurance_company_id
        ? Number(insurance_company_id)
        : null,

      policy_type_id
        ? Number(policy_type_id)
        : null,

      vehicle_category_id
        ? Number(vehicle_category_id)
        : null,

      vehicle_class_id
        ? Number(vehicle_class_id)
        : null,
    ];

    pool.query(
      sql,
      params,
      callback,
    );
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
        vehicle_class_id IS NOT NULL DESC,
        effective_from DESC

      LIMIT 1
    `;

    const params = [
      Number(product_id),

      insurance_company_id
        ? Number(insurance_company_id)
        : null,

      policy_type_id
        ? Number(policy_type_id)
        : null,

      vehicle_category_id
        ? Number(vehicle_category_id)
        : null,

      vehicle_class_id
        ? Number(vehicle_class_id)
        : null,
    ];

    pool.query(
      sql,
      params,
      callback,
    );
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

      ORDER BY
        effective_from DESC
    `;

    pool.query(
      sql,
      callback,
    );
  },

  // =========================================================
  // CALCULATE OD PREMIUM
  //
  // No separate age adjustment.
  //
  // The selected OD slab already contains the applicable
  // rate for the vehicle age.
  // =========================================================
  calculateODPremium: (
    idv,
    odRate,
    ncbRule,
    discountRule,
    callback,
  ) => {
    try {
      const originalIDV =
        Number(idv) || 0;

      // =====================================================
      // INVALID IDV
      // =====================================================

      if (originalIDV <= 0) {
        return callback(null, {
          idv: 0,

          od_rate_id: null,
          od_rate_slab_id: null,

          engine_cc_slab_id: null,
          gvw_slab_id: null,

          rate_type: null,

          base_od_rate: 0,

          basic_od_premium: 0,

          ncb_percentage: 0,
          ncb_amount: 0,

          premium_after_ncb: 0,

          discount_percentage: 0,
          discount_amount: 0,

          final_od_premium: 0,
        });
      }

      // =====================================================
      // OD RATE NOT FOUND
      // =====================================================

      if (
        !odRate ||
        !odRate.length
      ) {
        return callback(
          new Error(
            "Applicable OD rate not found",
          ),
        );
      }

      const selectedRate =
        odRate[0];

      // =====================================================
      // RATE TYPE
      // =====================================================

      const rateType =
        selectedRate.rate_type ||
        "PERCENTAGE";

      // =====================================================
      // SELECTED RATE
      //
      // Slab rate takes priority.
      // If slab rate is NULL, master rate is used.
      // =====================================================

      const baseRate =
        Number(
          selectedRate.slab_rate_value ??
            selectedRate.master_rate_value ??
            0,
        );

      // =====================================================
      // BASIC OD PREMIUM
      // =====================================================

      let basicODPremium = 0;

      if (
        rateType ===
        "PERCENTAGE"
      ) {
        basicODPremium =
          (
            originalIDV *
            baseRate
          ) / 100;
      } else if (
        rateType ===
        "FIXED"
      ) {
        basicODPremium =
          baseRate;
      }

      basicODPremium =
        Math.max(
          basicODPremium,
          0,
        );

      // =====================================================
      // NCB
      // =====================================================

      let ncbPercentage = 0;

      if (
        ncbRule &&
        ncbRule.length
      ) {
        ncbPercentage =
          Number(
            ncbRule[0]
              .calculated_ncb_percentage ??
              ncbRule[0]
                .ncb_percentage,
          ) || 0;
      }

      ncbPercentage =
        Math.min(
          Math.max(
            ncbPercentage,
            0,
          ),
          100,
        );

      const ncbAmount =
        (
          basicODPremium *
          ncbPercentage
        ) / 100;

      const premiumAfterNCB =
        Math.max(
          basicODPremium -
            ncbAmount,
          0,
        );

      // =====================================================
      // DISCOUNT
      // =====================================================

      let discountPercentage =
        0;

      let discountAmount =
        0;

      if (
        discountRule &&
        discountRule.length
      ) {
        const discount =
          discountRule[0];

        if (
          discount.discount_type ===
          "PERCENTAGE"
        ) {
          discountPercentage =
            Number(
              discount.discount_value,
            ) || 0;

          discountPercentage =
            Math.min(
              Math.max(
                discountPercentage,
                0,
              ),
              100,
            );

          discountAmount =
            (
              premiumAfterNCB *
              discountPercentage
            ) / 100;
        } else if (
          discount.discount_type ===
          "FIXED"
        ) {
          discountAmount =
            Number(
              discount.discount_value,
            ) || 0;
        }
      }

      discountAmount =
        Math.min(
          Math.max(
            discountAmount,
            0,
          ),
          premiumAfterNCB,
        );

      // =====================================================
      // FINAL OD PREMIUM
      // =====================================================

      const finalODPremium =
        Math.max(
          premiumAfterNCB -
            discountAmount,
          0,
        );

      // =====================================================
      // RESULT
      // =====================================================

      return callback(null, {
        idv: Number(
          originalIDV.toFixed(2),
        ),

        od_rate_id:
          selectedRate.od_rate_id,

        od_rate_slab_id:
          selectedRate.od_rate_slab_id ||
          null,

        engine_cc_slab_id:
          selectedRate.engine_cc_slab_id ||
          null,

        gvw_slab_id:
          selectedRate.gvw_slab_id ||
          null,

        rate_type:
          rateType,

        base_od_rate:
          Number(
            baseRate.toFixed(4),
          ),

        basic_od_premium:
          Number(
            basicODPremium.toFixed(2),
          ),

        ncb_percentage:
          Number(
            ncbPercentage.toFixed(2),
          ),

        ncb_amount:
          Number(
            ncbAmount.toFixed(2),
          ),

        premium_after_ncb:
          Number(
            premiumAfterNCB.toFixed(2),
          ),

        discount_percentage:
          Number(
            discountPercentage.toFixed(2),
          ),

        discount_amount:
          Number(
            discountAmount.toFixed(2),
          ),

        final_od_premium:
          Number(
            finalODPremium.toFixed(2),
          ),
      });
    } catch (error) {
      return callback(error);
    }
  },

  // =========================================================
  // COMPLETE CALCULATION DATA
  // =========================================================
  getCalculationData: (
    data,
    callback,
  ) => {
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

    // =======================================================
    // OD RATE + OD SLAB
    // =======================================================

    MotorCalculationService.getODRate(
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      fuel_type_id,
      usage_id,
      vehicle_age_months,
      engine_cc,
      gvw,
      seating_capacity,
      (err, odRate) => {
        if (err) {
          return callback(err);
        }

        result.od_rate =
          odRate;

        // ===================================================
        // OD DEPRECIATION
        // ===================================================

        MotorCalculationService.getODDepreciation(
          product_id,
          policy_type_id,
          vehicle_age_months,
          (err, odDepreciation) => {
            if (err) {
              return callback(err);
            }

            result.od_depreciation =
              odDepreciation;

            // =================================================
            // TP RATE
            // =================================================

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
                if (err) {
                  return callback(err);
                }

                result.tp_rate =
                  tpRate;

                // =============================================
                // NCB RULE
                // =============================================

                MotorCalculationService.getNCBRule(
                  product_id,
                  policy_type_id,
                  previous_ncb_percentage,
                  previous_year_claim,
                  (err, ncbRule) => {
                    if (err) {
                      return callback(err);
                    }

                    result.ncb_rule =
                      ncbRule;

                    // =========================================
                    // DISCOUNT
                    // =========================================

                    MotorCalculationService.getDiscountRule(
                      insurance_company_id,
                      product_id,
                      policy_type_id,
                      vehicle_category_id,
                      vehicle_class_id,
                      usage_id,
                      vehicle_age_months,
                      (err, discountRule) => {
                        if (err) {
                          return callback(err);
                        }

                        result.discount_rule =
                          discountRule;

                        // =====================================
                        // CALCULATE OD PREMIUM
                        // =====================================

                        MotorCalculationService.calculateODPremium(
                          idv,
                          odRate,
                          ncbRule,
                          discountRule,
                          (err, odCalculation) => {
                            if (err) {
                              return callback(err);
                            }

                            result.od_calculation =
                              odCalculation;

                            // =================================
                            // ADDONS
                            // =================================

                            MotorCalculationService.getAddons(
                              insurance_company_id,
                              product_id,
                              policy_type_id,
                              vehicle_category_id,
                              vehicle_class_id,
                              vehicle_age_months,
                              idv,
                              (err, addons) => {
                                if (err) {
                                  return callback(err);
                                }

                                result.addons =
                                  addons;

                                // ===============================
                                // COVERS
                                // ===============================

                                MotorCalculationService.getCovers(
                                  insurance_company_id,
                                  product_id,
                                  policy_type_id,
                                  vehicle_category_id,
                                  vehicle_class_id,
                                  (err, covers) => {
                                    if (err) {
                                      return callback(err);
                                    }

                                    result.covers =
                                      covers;

                                    // =============================
                                    // COMMISSION
                                    // =============================

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

                                        result.commission =
                                          commission;

                                        // =========================
                                        // CASHBACK
                                        // =========================

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

                                            result.cashback =
                                              cashback;

                                            // =====================
                                            // TAX
                                            // =====================

                                            MotorCalculationService.getTax(
                                              (err, tax) => {
                                                if (err) {
                                                  return callback(
                                                    err,
                                                  );
                                                }

                                                result.tax =
                                                  tax;

                                                return callback(
                                                  null,
                                                  result,
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
    );
  },
};

module.exports =
  MotorCalculationService;