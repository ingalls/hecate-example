const users = [ 'logain_ablar', 'jonan_adley', 'aginor', 'lelaine_akashi', 'nalesean_aldiaya', 'algarin_pendaloan', 'alivia', 'katerine_alruddin', 'alviarin', 'amathera', 'merana_ambrey', 'amys', 'anaiya', 'setalle_anan', 'sashalle_anderly', 'rianna_andomeran', 'anlee', 'asmodean', 'saerin_asnobar', 'rhadam_asunawa', 'aviendha', 'perrin_aybara', 'edesina_azzedin', 'bain', 'bair', 'balthamel', 'balwer', 'teslyn_baradon', 'narenwin_barda', 'duhara_basaheen', 'davram_bashere', 'zarine_bashere', 'adelorna_bastine', 'sheriam_bayanar', 'belal', 'myrelle_berengari', 'falion_bhoda', 'nesune_bihara', 'jesse_bilal', 'erian_boroleos', 'silviana_brehon', 'gareth_bryne', 'joiya_byir', 'jeaine_caide', 'gaidal_cain', 'adine_canford', 'canler', 'carlinya_sorevin', 'carlomin', 'galina_casban', 'romanda_cassin', 'mat_cauthon', 'merilille_ceandevin', 'noal_charin', 'chiad', 'rafela_cindal', 'couladin', 'theodrin_dabei', 'zerah_dacan', 'nisao_dachen', 'masema_dagar', 'galad_damodred', 'moiraine_damodred', 'dark_one', 'corlan_dashiva', 'cetalia_delarme', 'talmanes_delovinde', 'demandred', 'bayle_domon', 'norine_dovarna', 'eadyth', 'edorion', 'elswell', 'chesmal_emry', 'enkazin', 'demira_eriff', 'erith', 'estean', 'padan_fain', 'min_farshaw', 'tarna_feir', 'dagdara_finchey', 'damer_flinn', 'andaya_forae', 'careane_fransi', 'ryma_galfrey', 'gaul', 'toveine_gazal', 'charl_gedwyn', 'marillin_gemalphin', 'androl_genhald', 'jur_grady', 'graendal', 'merise_haindehl', 'shaidar_haran', 'faeldrin_harella', 'bera_harkin', 'harldin', 'artur_hawkwing', 'seaine_herimon', 'eben_hopwil', 'corele_hovian', 'hurin', 'hopper', 'ishamael', 'rodel_ituralde', 'agelmar_jagad', 'eldrith_jhondar', 'janduin', 'welyn_kajima', 'furyk_karede', 'moria_karentanis', 'temaile_kinderode', 'raefar_kisman', 'kumira_dhoran', 'mezar_kurin', 'lanfear', 'annoura_larisen', 'atuan_larisett', 'liandrin_guirale', 'loial', 'lyrelle_arienwin', 'machin_shin', 'elyas_machera', 'maigan', 'arel_malevin', 'mandevwin', 'lan_mandragoran', 'karldin_manfor', 'tigraine_mantear', 'beonin_marinye', 'mashadar', 'verin_mathwin', 'joline_maza', 'nynaeve_almeara', 'cabriana_mecandes', 'meidani_eschede', 'cadsuane_melaidhrin', 'thom_merrilin', 'mesaana', 'talene_minly', 'atal_mishraile', 'miyasi', 'ilyena_moerelle', 'moghedien', 'mordeth', 'gitara_moroso', 'fedwin_morr', 'morvrin_thakanos', 'delana_mosalaine', 'daigian_moseneillin', 'alanna_mosvani', 'kiruna_nachiman', 'malind_nachenin', 'amico_nagoyin', 'aeldra_najaf', 'arlen_nalaam', 'adeleas_namelle', 'vandene_namelle', 'jahar_narishma', 'berylla_naron', 'fager_neald', 'ferane_neheran', 'sarene_nemdahl', 'varil_nensen', 'pedron_niall', 'norley', 'beldeine_nyram', 'ogier', 'olver', 'daerid_ondin', 'faolain_orande', 'tamra_ospenya', 'birlen_pena', 'elza_penfell', 'rahvin', 'tsutama_rath', 'merean_redhill', 'reimon', 'rhuarc', 'manel_rochaid', 'elaida_aroihan', 'robb_solter', 'sammael', 'donalo_sandomere', 'karale_sanghir', 'semirhage', 'siuan_sanche', 'juilin_sandar', 'saml_alseen', 'selucia', 'leane_sharif', 'ispan_shefar', 'birgitte_silverbow', 'slayer', 'masuri_sokawa', 'someshta', 'sorilea', 'fera_sormen', 'kairen_stang', 'aeldene_stonebridge', 'sulin', 'mazrim_taim', 'takima_deraighdin', 'samitsu_tamagowa', 'pevara_tazanovni', 'lews_therin', 'therava', 'rand_althor', 'tam_althor', 'marris_thornhill', 'salita_toranes', 'peral_torval', 'seonid_traighan', 'elayne_trakand', 'gawyn_trakand', 'morgase_trakand', 'nicola_treehill', 'tuon', 'eamon_valda', 'egwene_alvere', 'evin_vinchova', 'yukiri_haruna', 'asne_zeramene' ];
const Q = require('d3-queue').queue;

/**
 * Create a given number of users
 *
 * @param {Object} hecate Instantiated Hecate Instance
 * @param {Object} opts User creation options
 * @param {Number} opts.desired Number of users to create (max of users.length)
 * @param {Function} cb Callback
 */
function user(hecate, opts = {}, cb) {
    if (!opts.desired) opts.desired = 10;
    if (opts.desired > users.length) opts.desired = users.length;

    const q = new Q();
    for (let user_it = 0; user_it < opts.desired; user_it++) {
        q.defer((user, done) => {
            hecate._.user.register({
                email: `${user}@hecate.example`,
                username: user,
                password: 'yeahehyeah'
            }, done);
        }, users[user_it]);
    }
    q.awaitAll((err) => {
        if (err) throw err;

        return cb();
    });
}

module.exports = user;
