const pool = require("../../../dbconfig/dbconfig");

const MotorOdRateSlabService = {

  // =========================================================
  // CREATE
  // =========================================================

  createOdRateSlab: (data, callback) => {

    const {
      od_rate_id,
      engine_cc_slab_id,
      gvw_slab_id,

      min_seating_capacity,
      max_seating_capacity,

      min_age_months,
      max_age_months,

      rate_value,
      description,
      is_active,
    } = data;


    const query = `
      INSERT INTO motor_od_rate_slab (
        od_rate_id,

        engine_cc_slab_id,
        gvw_slab_id,

        min_seating_capacity,
        max_seating_capacity,

        min_age_months,
        max_age_months,

        rate_value,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    pool.query(
      query,
      [
        od_rate_id,

        engine_cc_slab_id || null,
        gvw_slab_id || null,

        min_seating_capacity ?? null,
        max_seating_capacity ?? null,

        min_age_months ?? null,
        max_age_months ?? null,

        rate_value,
        description || null,
        is_active ?? 1,
      ],
      callback
    );
  },


  // =========================================================
  // GET ALL
  // =========================================================

  getAllOdRateSlabs: (callback) => {

    const query = `
      SELECT

        ors.od_rate_slab_id,

        /* =====================================================
           OD RATE MASTER
        ===================================================== */

        ors.od_rate_id,

        orm.insurance_company_id,
        ic.company_name AS insurance_company_name,

        orm.product_id,
        pm.product_name,

        orm.policy_type_id,
        ptm.policy_type_name,

        orm.vehicle_category_id,
        mvc.category_name,

        orm.vehicle_class_id,
        mvc_class.class_name,

        orm.fuel_type_id,
        mft.fuel_name,

        orm.usage_id,
        mvu.usage_name,

        orm.rate_type,

        orm.rate_value AS master_rate_value,

        orm.effective_from,
        orm.effective_to,


        /* =====================================================
           OD SLAB
        ===================================================== */

        ors.engine_cc_slab_id,

        ecc.slab_name AS engine_cc_slab_name,
        ecc.min_cc AS engine_cc_min,
        ecc.max_cc AS engine_cc_max,


        ors.gvw_slab_id,

        gvw.slab_name AS gvw_slab_name,
        gvw.min_gvw AS gvw_min,
        gvw.max_gvw AS gvw_max,


        ors.min_seating_capacity,
        ors.max_seating_capacity,


        /* VEHICLE AGE */

        ors.min_age_months,
        ors.max_age_months,


        /* SLAB RATE */

        ors.rate_value,


        ors.description,
        ors.is_active,

        ors.created_at,
        ors.updated_at


      FROM motor_od_rate_slab ors


      /* =====================================================
         OD RATE MASTER
      ===================================================== */

      INNER JOIN motor_od_rate_master orm
        ON orm.od_rate_id = ors.od_rate_id


      /* =====================================================
         INSURANCE COMPANY
      ===================================================== */

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = orm.insurance_company_id


      /* =====================================================
         PRODUCT
      ===================================================== */

      LEFT JOIN motor_product_master pm
        ON pm.product_id = orm.product_id


      /* =====================================================
         POLICY TYPE
      ===================================================== */

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = orm.policy_type_id


      /* =====================================================
         VEHICLE CATEGORY
      ===================================================== */

      LEFT JOIN motor_vehicle_categories mvc
        ON mvc.vehicle_category_id = orm.vehicle_category_id


      /* =====================================================
         VEHICLE CLASS
      ===================================================== */

      LEFT JOIN motor_vehicle_classes mvc_class
        ON mvc_class.vehicle_class_id = orm.vehicle_class_id


      /* =====================================================
         FUEL
      ===================================================== */

      LEFT JOIN motor_fuel_types mft
        ON mft.fuel_type_id = orm.fuel_type_id


      /* =====================================================
         USAGE
      ===================================================== */

      LEFT JOIN motor_vehicle_usages mvu
        ON mvu.usage_id = orm.usage_id


      /* =====================================================
         ENGINE CC SLAB
      ===================================================== */

      LEFT JOIN motor_engine_cc_slabs ecc
        ON ecc.engine_cc_slab_id = ors.engine_cc_slab_id


      /* =====================================================
         GVW SLAB
      ===================================================== */

      LEFT JOIN motor_gvw_slabs gvw
        ON gvw.gvw_slab_id = ors.gvw_slab_id


      ORDER BY
        ors.od_rate_id DESC,
        ors.od_rate_slab_id DESC
    `;


    pool.query(query, callback);
  },


  // =========================================================
  // GET BY ID
  // =========================================================

  getOdRateSlabById: (od_rate_slab_id, callback) => {

    const query = `
      SELECT

        ors.od_rate_slab_id,

        ors.od_rate_id,


        /* ENGINE CC */

        ors.engine_cc_slab_id,

        ecc.slab_name AS engine_cc_slab_name,


        /* GVW */

        ors.gvw_slab_id,

        gvw.slab_name AS gvw_slab_name,


        /* SEATING */

        ors.min_seating_capacity,
        ors.max_seating_capacity,


        /* VEHICLE AGE */

        ors.min_age_months,
        ors.max_age_months,


        /* RATE */

        ors.rate_value,


        ors.description,
        ors.is_active,

        ors.created_at,
        ors.updated_at


      FROM motor_od_rate_slab ors


      LEFT JOIN motor_engine_cc_slabs ecc
        ON ecc.engine_cc_slab_id = ors.engine_cc_slab_id


      LEFT JOIN motor_gvw_slabs gvw
        ON gvw.gvw_slab_id = ors.gvw_slab_id


      WHERE ors.od_rate_slab_id = ?
    `;


    pool.query(
      query,
      [od_rate_slab_id],
      callback
    );
  },


  // =========================================================
  // UPDATE
  // =========================================================

  updateOdRateSlab: (od_rate_slab_id, data, callback) => {

    const {
      od_rate_id,

      engine_cc_slab_id,
      gvw_slab_id,

      min_seating_capacity,
      max_seating_capacity,

      min_age_months,
      max_age_months,

      rate_value,
      description,
      is_active,
    } = data;


    const query = `
      UPDATE motor_od_rate_slab

      SET

        od_rate_id = ?,

        engine_cc_slab_id = ?,
        gvw_slab_id = ?,

        min_seating_capacity = ?,
        max_seating_capacity = ?,

        min_age_months = ?,
        max_age_months = ?,

        rate_value = ?,
        description = ?,
        is_active = ?

      WHERE od_rate_slab_id = ?
    `;


    pool.query(
      query,
      [

        od_rate_id,

        engine_cc_slab_id || null,
        gvw_slab_id || null,

        min_seating_capacity ?? null,
        max_seating_capacity ?? null,

        min_age_months ?? null,
        max_age_months ?? null,

        rate_value,

        description || null,

        is_active ?? 1,

        od_rate_slab_id,
      ],
      callback
    );
  },


  // =========================================================
  // DELETE / SOFT DELETE
  // =========================================================

  deleteOdRateSlab: (od_rate_slab_id, callback) => {

    const query = `
      UPDATE motor_od_rate_slab

      SET is_active = 0

      WHERE od_rate_slab_id = ?
    `;


    pool.query(
      query,
      [od_rate_slab_id],
      callback
    );
  },


  // =========================================================
  // GET ACTIVE
  // =========================================================

  getActiveOdRateSlabs: (callback) => {

    const query = `
      SELECT

        ors.od_rate_slab_id,

        ors.od_rate_id,


        /* ENGINE CC */

        ors.engine_cc_slab_id,

        ecc.slab_name AS engine_cc_slab_name,


        /* GVW */

        ors.gvw_slab_id,

        gvw.slab_name AS gvw_slab_name,


        /* SEATING */

        ors.min_seating_capacity,
        ors.max_seating_capacity,


        /* VEHICLE AGE */

        ors.min_age_months,
        ors.max_age_months,


        /* RATE */

        ors.rate_value,


        ors.description


      FROM motor_od_rate_slab ors


      LEFT JOIN motor_engine_cc_slabs ecc
        ON ecc.engine_cc_slab_id = ors.engine_cc_slab_id


      LEFT JOIN motor_gvw_slabs gvw
        ON gvw.gvw_slab_id = ors.gvw_slab_id


      WHERE ors.is_active = 1


      ORDER BY
        ors.od_rate_id DESC,
        ors.od_rate_slab_id DESC
    `;


    pool.query(
      query,
      callback
    );
  },
};


module.exports = MotorOdRateSlabService;