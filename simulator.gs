// シミュレーター
function simulation() {
  const sheet_1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("メイン");
  const sheet_2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("計算貼り付け");
  const sheet_3 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("結果");
  const sheet_4 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TL記入");
  const sheet_5 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("n回試行");
  const data_1 = sheet_1.getRange(5,3,23,6).getValues();
  const data_2 = sheet_1.getRange(30,3,25,6).getValues();
  const data_3 = sheet_1.getRange(13, 15, 8,7).getValues();
  const data_4 = sheet_1.getRange(5, 30, 4,6).getValues();
  const data_5 = sheet_1.getRange(12, 30, 5, 6).getValues();
  const data_6 = sheet_1.getRange(26, 16, 6, 6).getValues();
  const data_7 = sheet_4.getRange(6, 30, 100, 4).getValues();



  // 変数定義(その他)

  var total_damage = 0;
  var result = new Array(6);
  var tl_type = data_4[0][0];
  var randam_result = [];
  result.fill("");




  // キャラ配列
  var chara_array = [];

  // キャラ変数定義
  if (data_1[0][5] != "") {
    var chara_1 = difine(5);
    chara_array.push(chara_1);
  }
  if (data_1[0][4] != "") {
    var chara_2 = difine(4);
    chara_array.push(chara_2);
  }
  if (data_1[0][3] != "") {
  　var chara_3 = difine(3);
    chara_array.push(chara_3);
  }
  if (data_1[0][2] != "") {
  　var chara_4 = difine(2);
    chara_array.push(chara_4);
  }
  if (data_1[0][1] != "") {
  　var chara_5 = difine(1);
    chara_array.push(chara_5);
  }

  // 変数を定義する関数
  function difine(n) {
    let chara =
    {
      index: 6-n,
      num: data_1[0][n],
      type: data_1[21][n],
      lv: data_1[3][n],
      ub_lv: data_1[17][n],
      s1_lv: data_1[18][n],
      s2_lv: data_1[19][n],
      ex_lv: data_1[20][n],
      hp_max: data_1[2][n],
      atk: data_1[4][n],
      mat: data_1[5][n],
      def: data_1[6][n],
      mde: data_1[7][n],
      tpu: data_1[8][n],
      tpr: data_1[9][n],
      acr: data_1[10][n],
      mcr: data_1[11][n],
      hit: data_1[12][n],
      avoidance: data_1[13][n],
      heel_up: data_1[14][n],
      hp_absorption: data_1[15][n],
      formation: data_1[16][n],
      moob_array: moobArraymaker(replace(data_2)[n].slice(0,10).filter(function(value){return value !== ''}),
      replace(data_2)[n].slice(10, 25).filter(function(value){return value !== ''})),

      tp: 0,
      hp: 0,

      // 多段ヒット攻撃の1hit目のダメージを記憶するもの
      damage_array: [],
      // トータルのダメージをキャラごとに記憶しておくもの
      total_damage_array: [],
      // 行動速度バフは開始1F目で決まるため、それを記憶するもの
      speed: 0,
      // speedの値は途中で変わってしまうため、行動開始次の待機時間を記憶するためのもの(初期値は干渉しないように100)
      wait_time: 100,

      // UB硬直時間
      ub_bind_time: 0,
      // 硬直
      bind: 0,

      moob_count: -1,
      moob_schedule: [],
      moob_onoff: 0,
      start_time: data_1[22][n],
      start_time_original:  data_1[22][n],
      end_time: data_1[22][n]-1,
      buff_atk: [],
      buff_mat: [],
      buff_def: [],
      buff_mde: [],
      buff_acr: [],
      buff_mcr: [],
      buff_tpu: [],
      buff_speed: [[0, 0, 0, 0]],
      buff_speed_karin: [],
      buff_hp: [],


      // クリダメアップ
      buff_acu: [],
      buff_mcu: [],

      // クリティカル計算の種類
      cr_type: data_6[0][n],




      // 出力用
      output_moob: [],
      output_atk: [],
      output_cu: [],
      output_sp: [],
      output_tp: [],
      output_tpu: [],

      // tlについて
      tl_1_auto: data_4[2][n],
      tl_1_set: data_4[3][n],

      tl_2_auto: data_5[0][n],
      tl_2_n: data_5[1][n],
      tl_2_s1: data_5[2][n],
      tl_2_s2: data_5[3][n],
      tl_2_s3: data_5[4][n]















      // スキル使用時に追加するオブジェクト
      //kaori_count　：　カオリの精神統一のカウント
    }

    return chara;

  }









  // 変数定義(ボス)
  var boss = {

    num:  data_1[0][0],
    lv: data_1[3][0],
    hp: data_1[2][0],
    atk: data_1[4][0],
    mat: data_1[5][0],
    def: data_1[6][0],
    mde: data_1[7][0],
    tpu: data_1[8][0],
    tpr: data_1[9][0],

    // 銀防御

    silver_def: data_1[10][0],
    silver_mde: data_1[11][0],

    // バフ用の配列

    buff_atk: [],
    buff_mat: [],
    buff_def: [],
    buff_mde: [],

    // 被クリダメアップ(Shot attack critical)
    buff_sc: [],
    buff_sac: [],
    buff_smc: [],

    // 被ダメアップ(Shot attack up)
    buff_sau: [],
    buff_smu: [],

    // 状態異常系(毒、猛毒)
    poison: [],
    very_poison: [],



    // 出力用
    output_def: [],
    output_sc: [],
    output_sc_seiyuni: [],
    output_tp: [],
    //　出力するときのダメージを記憶しておくもの
    total_damage_array: []


  };



  // 条件およびTL
  var condition = {
    // TL3
    tl_3: data_7,
    tl_3_original: data_7,
    tl_3_count: 0,

    // 拘束について
    bind_tl: sheet_4.getRange(6, 39, 100, 3).getValues(),
    bind_tl_original: sheet_4.getRange(6, 39, 100, 3).getValues(),
    bind_tl_count: 0,
    bind_onoff: data_6[2][0],

    // ログバリア
    logBarrier_onoff: data_6[1][0],

    // ランダム試行
    randam_onoff: data_6[3][0]

  };







  //変数定義(結果出力用条件)
  var result_condition = {
    // ボスに関する条件
    boss_damage: data_3[0][1],
    boss_def: data_3[1][1],
    boss_scr: data_3[2][1],
    boss_sc: data_3[3][1],
    boss_tp: data_3[4][1],

    //キャラに関する条件
    chara_damage: data_3[0][3],
    chara_moob: data_3[1][3],
    chara_atk: data_3[2][3],
    chara_cu: data_3[3][3],
    chara_sp: data_3[4][3],
    chara_tp: data_3[5][3],
    chara_tpu: data_3[6][3],

    // 全体の条件
    method: 0,
  }

  result_condition.method += 1*data_3[1][5] - 1*data_3[1][6];















  // ========================キャラのスキルまとめ========================

  var database = [
  // サオイ
  {
    // 速度ダウン未実装
    ub: function(t, chara, boss) {
      let buff = -1*Math.ceil(2.25*(1+chara.ub_lv));
      buffAdd(t, boss.buff_def, 1, 1080, buff);
      let poison = Math.floor(20*(1+chara.ub_lv));
      boss.very_poison = [t, 1080, poison, chara];
    },
    // 弾 ガーゴイルだと(76/81にするとちょうどいい)
    n: function(t, chara, boss) {
      waitCal(t, chara, 109);
      switch(t - chara.start_time - chara.wait_time) {
        case 76:
          addDamage(t, chara, damageCal(t, chara, boss, 0, 0, 1, [1])[0]);
          break;
        case 81:
          moobEnd(t, chara);
          break;
      }

    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 28);
      switch(t - chara.start_time - chara.wait_time) {
        case 139:
          addDamage(t, chara, damageCal(t, chara, boss, chara.s1_lv, 3, 0.24, [1])[0]);
          break;
        case 140:
          let buff = -1*Math.ceil(0.5*(1+chara.s1_lv));
          buffAdd(t, boss.buff_def, 1, 720, buff);
          let poison = Math.floor(3.75*(1+chara.s1_lv));
          boss.poison = [t, 1440, poison, chara];
          break;
        case 173:
          moobEnd(t, chara);
          break;
      }

    },
    // 麻痺未実装(弾)
    s2: function(t, chara, boss) {
      waitCal(t, chara, 28);
      switch(t - chara.start_time - chara.wait_time){
        case 112:
          addDamage(t, chara, damageCal(t, chara, boss, chara.s2_lv, 5, 0.4, [1])[0]);
          break;
        case 113:
          //麻痺
          break;
        case 162:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff =  240 + 15*chara.ex_lv;
      buffAdd(t, chara.buff_atk, 1, 10800, buff);
    }
  },

  // カオリ
  {
    ub: function(t, chara, boss) {
      let buff = Math.ceil(15*(1+chara.ub_lv));
      buffAdd(t, chara.buff_atk, 1, 10800, buff);

      damageCal(t, chara, boss, chara.ub_lv, 180, 14.4, [1,1,1,1,1,1,1,1,1])

      addDamage(t, chara, sum(chara.damage_array));
    },
    n: function(t, chara, boss) {
      waitCal(t, chara, 130);
      switch(t - chara.start_time - chara.wait_time) {
        case 18:
          addDamage(t, chara, damageCal(t, chara, boss, 0, 0, 1, [1])[0]);
          break;
        case 63:
          moobEnd(t, chara);
          break;
      }

    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 60);
      switch(t - chara.start_time - chara.wait_time) {
        case 50:
          addDamage(t, chara, damageCal(t, chara, boss, chara.s1_lv, 30, 2.3, [1])[0]);
          break;
        case 122:
          moobEnd(t, chara);
          break;
      }

    },
    s2: function(t, chara) {
      waitCal(t, chara, 60);
      switch(t - chara.start_time - chara.wait_time){
        case 42:
          // 精神統一のカウント
          chara["count_kaori"] = 0;
          break;
        case 120:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff =  240 + 15*chara.ex_lv;
      buffAdd(t, chara.buff_atk, 1, 10800, buff);
    }
  },

  // 水コロ
  {
    // 回復未実装
    ub: function(t, chara, boss) {
      let buff_atk = 24*(1 + chara.ub_lv);
      buffAddMulti(0, t, chara_array, 1, 1080, buff_atk);
      buffAddMulti(8, t, chara_array, 1, 1080, 10);
      buffAddMulti(6, t, chara_array, 1, 1080, 0.2);

      let debuff = -1*Math.ceil(0.4*(1+chara.ub_lv));
      buffAdd(t, boss.buff_def, 1, 1080, debuff);
    },
    n: function(t, chara, boss) {
      waitCal(t, chara, 141);
      switch(t - chara.start_time - chara.wait_time) {
        case 21:
          addDamage(t, chara, damageCal(t, chara, boss, 0, 0, 1, [1])[0]);
          break;
        case 70:
          moobEnd(t, chara);
          break;
      }

    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 42);
      switch(t - chara.start_time - chara.wait_time) {
        case 24:
          chara.kokkoro_formation = chara.formation;
          chara.formation -= 435;
          if (chara.formation < 0) {
            chara.formation = 0;
          }
          break;
        case 56:
          addDamage(t, chara, damageCal(t, chara, boss, chara.s1_lv, 10, 0.8, [1])[0]);
          break;
        case 57:
          let buff = -1*(1+chara.s1_lv);
          buffAdd(t, boss.buff_def, 1, 720, buff);
          break;
        case 122:
          chara.formation = chara.kokkoro_formation;
          break;
        case 154:
          moobEnd(t, chara);
          break;
      }

    },
    s2: function(t, chara, boss) {
      waitCal(t, chara, 36);
      switch(t - chara.start_time - chara.wait_time){
        case 78:
          let buff = 6*(1+chara.s2_lv);
          buffAddMulti(0, t, chara_array, 1, 720, buff);

          break;
        case 160:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff = 32 + 2*chara.ex_lv;
      buffAdd(t, chara.buff_def, 1, 10800, buff);

      chara["kokkoro_formation"] = 0;
    }
  },
  // ジータ
  {
    ub: function(t, chara, boss) {
      damageCal(t, chara, boss, chara.ub_lv, 93.75, 7.5, [1,1,1,1,1,1,1,1])

      addDamage(t, chara, sum(chara.damage_array));

      let buff = Math.ceil(40*(1+chara.ub_lv));
      buffAdd(t, chara.buff_atk, 1, 1080, buff);
    },
    n: function(t, chara, boss) {
      waitCal(t, chara, 118);
      switch (t - chara.start_time - chara.wait_time){
        case 21:
          addDamage(t, chara, damageCal(t, chara, boss, 0, 0, 1, [1])[0]);
          break;
        case 80:
          moobEnd(t, chara);
          break;
      }
    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 21);
      switch (t - chara.start_time - chara.wait_time){
        case 1:
          addTp(t, chara, 200);
          addTpMulti(t, exceptArray(chara_array, chara), 100);
          break;
        case 18:
          damageCal(t, chara, boss, chara.s1_lv, 60, 4.8, [1,1,1,1]);
          addDamage(t, chara, chara.damage_array[0]);
          break;
        case 66:
          addDamage(t, chara, chara.damage_array[1]);
          break;
        case 94:
          addDamage(t, chara, chara.damage_array[2]);
          break;
        case 114:
          addDamage(t, chara, chara.damage_array[3]);
          break;
        case 160:
          moobEnd(t, chara);
          break;
      }
    },
    s2: function(t, chara, boss) {
      waitCal(t, chara, 40)
      switch (t - chara.start_time - chara.wait_time){
        case 1:
          let tp = Math.ceil(180 + 1.5*chara.s2_lv);
          addTp(t, chara, tp);
          break;
        case 19:
          damageCal(t, chara, boss, chara.s2_lv, 37.5, 3, [1,1,1]);
          addDamage(t, chara, chara.damage_array[0]);
          break;
        case 54:
          addDamage(t, chara, chara.damage_array[1]);
          break;
        case 95:
          addDamage(t, chara, chara.damage_array[2]);
          break;
        case 140:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff =  240 + 15*chara.ex_lv;
      buffAdd(t, chara.buff_atk, 1, 10800, buff);

      //UB硬直時間の設定
      chara.ub_bind_time = 0;
    }
  },
  // モニカ
  {
    // スタン未実装
    ub: function(t, chara, boss) {
      damageCal(t, chara, boss, chara.ub_lv, 30, 2.4, [1,1,1,1,1]);
      addDamage(t, chara, sum(chara.damage_array));

      let buff = 12*(1+chara.ub_lv);
      buffAddMulti(0, t, chara_array, 1, 1800, buff);
      buffAddMulti(2, t, chara_array, 1, 1800, buff);
      buffAddMulti(9, t, chara_array, 1, 1800, 1);
    },
    n: function(t, chara, boss) {
      waitCal(t, chara, 135);
      switch(t - chara.start_time - chara.wait_time) {
        case 21:
          addDamage(t, chara, damageCal(t, chara, boss, 0, 0, 1, [1])[0]);
          break;
        case 70:
          moobEnd(t, chara);
          break;
      }

    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 64);
      switch(t - chara.start_time - chara.wait_time) {
        case 35:
          let buff = 12*(1 + chara.s1_lv);

          buffAddMulti(0, t, chara_array, 1, 1200, buff);
          buffAddMulti(2, t, chara_array, 1, 1200, buff);
          buffAddMulti(9, t, chara_array, 1, 1200, 1);
          break;
        case 130:
          moobEnd(t, chara);
          break;
      }

    },
    // スタン未実装
    s2: function(t, chara, boss) {
      waitCal(t, chara, 52);
      switch(t - chara.start_time - chara.wait_time){
        case 93:
          addDamage(t, chara, damageCal(t, chara, boss, chara.s2_lv, 10, 0.8, [1])[0]);
          break;
        case 150:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff_atk = 15 + 15*chara.ex_lv;
      buffAdd(t, chara.buff_atk, 1, 10800, buff_atk);
      buffAdd(t, chara.buff_def, 1, 10800, 30);
    }
  },

  // 聖ユニ
  {
    ub: function(t, chara, boss) {
      let buff = 12*(1+chara.ub_lv);
      buffAddMulti(0, t, exceptArray(chara_array, chara), 1, 1080, buff);
      buffAddMulti(2, t, exceptArray(chara_array, chara), 1, 1080, buff);

      if(chara.count_seiyuni + 1080 > t　&& chara.count_seiyuni != 0) {
        buffAddMulti(6, t, exceptArray(chara_array, chara), 1, 1080, 0.12);
        buffAddMulti(7, t, exceptArray(chara_array, chara), 1, 1080, 0.12);
      }

      chara.count_seiyuni = t;
    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 28);
      switch(t - chara.start_time - chara.wait_time) {
        case 93:
          let debuff = -1*Math.ceil(0.3*(1+chara.s1_lv));

          buffAdd(t, boss.buff_def, 1, 720, debuff);
          buffAdd(t, boss.buff_mde, 1, 720, debuff);

          if (chara.count_seiyuni + 1080 > t　&& chara.count_seiyuni != 0) {
            buffAdd(t, boss.buff_sc, 1, 720, 0.08);
          }
          break;
        case 151:
          moobEnd(t, chara);
          break;
      }

    },
    s2: function(t, chara, boss) {
      waitCal(t, chara, 38);
      switch(t - chara.start_time - chara.wait_time){
        case 61:
          buffAddMulti(8, t, exceptArray(chara_array, chara), 1, 720, 5);
          break;
        case 98:
          buffAddMulti(9, t, exceptArray(chara_array, chara), 1, 720, 0.5);

          if (chara.count_seiyuni + 1080 > t　&& chara.count_seiyuni != 0) {
            let tp =Math.ceil(12 + 0.12*chara.s2_lv);
            addTpMulti(t, exceptArray(chara_array, chara), tp);
          }
          break;
        case 150:
          moobEnd(t, chara);
          break;
      }
    },
    s3: function(t, chara, boss) {
      waitCal(t, chara, 132);
      switch(t - chara.start_time - chara.wait_time) {
        case 24:
          buffAddMulti(0, t, exceptArray(chara_array, chara), 2, 720, 0.22);
          buffAddMulti(2, t, exceptArray(chara_array, chara), 2, 720, 0.22);
          break;
        case 85:
          moobEnd(t, chara);
          break;
      }

    },
    ex: function(t, chara) {
      let buff = 75 + 75*chara.ex_lv;
      buffAdd(t, chara.buff_hp, 1, 10800, buff);

      // 学びの時間状態のオブジェクトの付与
      chara["count_seiyuni"] = 0;
    }
  },

  // リトリリ
  {
    ub: function(t, chara, boss) {
      let damage_ub = sum(damageCal(t, chara, boss, chara.ub_lv, 60, 4.8, [1,1,1,1]));
      chara.count_litlyli = 1;
      damage_ub += sum(damageCal(t, chara, boss, chara.ub_lv, 60, 4.8, [1,1,1]));
      chara.count_litlyli = 0;

      addDamage(t, chara, damage_ub);
    },
    n: function(t, chara, boss) {
      waitCal(t, chara, 90);
      switch(t - chara.start_time - chara.wait_time) {
        case 29:
          damageCal(t, chara, boss, 0, 0, 1, [1,1,1]);
          addDamage(t, chara, chara.damage_array[0]);
          break;
        case 35:
          addDamage(t, chara, chara.damage_array[1]);
          break;
        case 53:
          addDamage(t, chara, chara.damage_array[2]);
          break;
        case 95:
          moobEnd(t, chara);
          break;
      }

    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 8);
      switch(t - chara.start_time - chara.wait_time) {
        case 43:
          chara.litlyli_damage = damageCal(t, chara, boss, chara.s1_lv, 20, 1.6, [1,1]);
          addDamage(t, chara, chara.damage_array[0]);
          break;
        case 80:
          chara.litlyli_onoff = 1;
          damageCal(t, chara, boss, chara.s1_lv, 10, 0.8, [1]);
          chara.litlyli_onoff = 0;
          addDamage(t, chara, chara.damage_array[0]);
          break;
        case 127:
          addDamage(t, chara, chara.litlyli_damage[1]);
          break;
        case 160:
          moobEnd(t, chara);
          break;
      }

    },
    s2: function(t, chara) {
      waitCal(t, chara, 36);
      switch(t - chara.start_time - chara.wait_time){
        case 79:
          let buff_atk = 11*(1+chara.s2_lv);
          let debuff = -1*Math.ceil(0.6*(1+chara.s2_lv));

          buffAdd(t, chara.buff_atk, 1, 10800, buff_atk);
          buffAdd(t, chara.buff_acr, 1, 10800, 60);
          buffAdd(t, boss.buff_def, 1, 720, debuff);

          addTp(t, chara, 50);
          break;
        case 150:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff =  240 + 15*chara.ex_lv;
      buffAdd(t, chara.buff_atk, 1, 10800, buff);

      // 魔法攻撃部分の判定
      chara["litlyli_onoff"] = 0;
      chara["litlyli_damage"] = 0;
    }
  },

  // ニュッコロ
  {
    // HP回復およびHPリジェネは未実装
    ub: function(t, chara, boss) {
      let buff = 18*(1+chara.ub_lv);
      buffAddMulti(0, t, chara_array, 1, 1080, buff);
    },
    // 弾属性っぽい
    n: function(t, chara, boss) {
      waitCal(t, chara, 112);
      switch(t - chara.start_time - chara.wait_time) {
        case 37:
          addDamage(t, chara, damageCal(t, chara, boss, 0, 0, 1, [1])[0]);
          break;
        case 70:
          moobEnd(t, chara);
          break;
      }

    },
    // バリアと挑発は未実装
    s1: function(t, chara){
      waitCal(t, chara, 23);
      switch(t - chara.start_time - chara.wait_time) {
        case 122:
          let buff = Math.ceil(13.5*(1+chara.s1_lv));
          buffAddMulti(0, t, chara_array, 1, 720, buff);
          break;
        case 177:
          moobEnd(t, chara);
          break;
      }

    },
    s2: function(t, chara) {
      waitCal(t, chara, 43);
      switch(t - chara.start_time - chara.wait_time){
        case 0:
          chara.nyukkoro_target = mostChara(t, 0, chara_array);
          break;
        case 121:
          let buff = 12*(1+chara.s2_lv);
          buffAdd(t, chara.nyukkoro_target.buff_atk, 1, 720, buff);
          buffAdd(t, chara.nyukkoro_target.buff_acr, 1, 720, 100);
          buffAdd(t, chara.nyukkoro_target.buff_acu, 1, 720, 0.30);
          break;
        case 159:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff = 2 + 2*chara.ex_lv;
      buffAdd(t, chara.buff_def, 1, 10800, buff);

      // s2の飛び先の記憶するもの
      chara["nyukkoro_target"] = 0;
    }
  }



  ]







  //キャラの行動のコピペ用

  /*

  {
    ub: function(t, chara, boss) {

    },
    n: function(t, chara, boss) {
      waitCal(t, chara, 0);
      switch(t - chara.start_time - chara.wait_time) {
        case 0:

          break;
        case 200:
          moobEnd(t, chara);
          break;
      }

    },
    s1: function(t, chara, boss){
      waitCal(t, chara, 0);
      switch(t - chara.start_time - chara.wait_time) {
        case 0:

          break;
        case 200:
          moobEnd(t, chara);
          break;
      }

    },
    s2: function(t, chara) {
      waitCal(t, chara, 0);
      switch(t - chara.start_time - chara.wait_time){
        case 0:

          break;
        case 200:
          moobEnd(t, chara);
          break;
      }
    },
    ex: function(t, chara) {
      let buff =  chara.ex_lv;
      buffAdd(t, chara.buff_atk, 1, 10800, buff);
    }
  }

  */
















  // ===========================実際の計算==============================

  function moob(t, chara) {
    // 行動開始(待機時間)
    if (chara.end_time + 1 == t) {
      chara.moob_onoff = 0;
      chara.moob_count++;
    }

    // 行動開始(行動TP付与、速度バフの計算) 待機時間が0のキャラは行動が始まったちゃうから注意。
    if (chara.start_time + chara.wait_time == t) {
      chara.moob_onoff = 1;
      addTp(t, chara, 90);
      chara.speed = speedCal(t, chara);
    }

    // exスキル
    if (t == 0) {
      database[chara.num -1].ex(t, chara);
    }

　　//　行動計算

    if (chara.moob_array[chara.moob_count] == 0) {
      database[chara.num -1].n(t, chara, boss);

    } else if (chara.moob_array[chara.moob_count] == 1) {
      database[chara.num -1].s1(t, chara, boss);

    } else if (chara.moob_array[chara.moob_count] == 2){
      database[chara.num -1].s2(t, chara, boss);

    } else if (chara.moob_array[chara.moob_count] == 3){
      database[chara.num -1].s3(t, chara, boss);

    } else {

    }
  }

  // UBおよびTLについて
  function tl(t, chara_array, boss) {
    switch (tl_type) {
      case 1:
        // フルset
        for (let i=0; i<chara_array.length; i++) {
          if (chara_array[i].tl_1_set == true) {
            if (chara_array[i].tp >= 1000) {
              ub(t, chara_array[i], boss);
            }
          }
          // フルオート
          else {
            if (chara_array[i].tl_1_auto == true) {
              if (chara_array[i].moob_onoff == 0 && chara_array[i].tp>= 1000) {
               ub(t, chara_array[i], boss);
              }
            }
          }
        }
        break;
      case 2:
        //スマートset
        for (let i=0; i<chara_array.length; i++) {
          if (chara_array[i].tl_2_auto == true) {
            if (chara_array[i].tp >= 1000) {
              if (chara_array[i].moob_onoff == 0) {
                ub(t, chara_array[i], boss);
              }
              else {
                switch (chara_array[i].moob_array[chara_array[i].moob_count]) {
                  case 0:
                    if (t - chara_array[i].start_time -chara_array[i].wait_time >= chara_array[i].tl_2_n) {
                      ub(t, chara_array[i], boss);
                    }
                    break;
                  case 1:
                    if (t - chara_array[i].start_time -chara_array[i].wait_time >= chara_array[i].tl_2_s1) {
                      ub(t, chara_array[i], boss);
                    }
                    break;
                  case 2:
                    if (t - chara_array[i].start_time - chara_array[i].wait_time >= chara_array[i].tl_2_s2) {
                      ub(t, chara_array[i], boss);
                    }
                    break;
                  case 3:
                    if (t - chara_array[i].start_time - chara_array[i].wait_time >= chara_array[i].tl_2_s3) {
                      ub(t, chara_array[i], boss);
                    }
                    break;
                }
              }
            }
          }
        }
        break;
      case 3:
      // TL(ボスの情報が正確に出ていない時のバフとデバフを調べるためのもの)
        for(let i=0; i<5; i++) {
          if (condition.tl_3[condition.tl_3_count][0] === "") {
            break;
          } else {
            let target_chara = chara_array[condition.tl_3[condition.tl_3_count][1]];
            let main_chara = chara_array[condition.tl_3[condition.tl_3_count][0]];

            if (target_chara.moob_count == condition.tl_3[condition.tl_3_count][2]-1) {
              if (t - target_chara.start_time - target_chara.wait_time >= condition.tl_3[condition.tl_3_count][3]) {
                ub(t, main_chara, boss);
                condition.tl_3_count++;
              } else {
                break;
              }
            }
            // とあるキャラのUB後すぐに打ちたいとき
            else if (condition.tl_3[condition.tl_3_count][2]-1 < target_chara.moob_count) {
              ub(t, main_chara, boss);
              condition.tl_3_count++;
            }
            // それ以外ならループ終了
            else {
              break;
            }
          }
        }
        break;
    }
  }


  // キャラの拘束のTLの再現
  function tlBind(t, chara_array){
    for (let i=0; i<5; i++) {
      if (t == condition.bind_tl[condition.bind_tl_count][1]) {

        bind(t, chara_array[condition.bind_tl[condition.bind_tl_count][0]], condition.bind_tl[condition.bind_tl_count][2]);
        condition.bind_tl_count++;

      } else {
        break;
      }
    }
  }







  // ボスの継続ダメージ
  function bossContinue(t, boss) {
    // 毒ダメージ。毒が入った瞬間を0fとすると初回61f目にダメ入る。60f間隔でダメージ。
    if (boss.poison[0] != ""&& boss.poison[0]+boss.poison[1]>t) {
      if ((t - boss.poison[0])%60 == 1 && t > boss.poison[0] + 1) {
         addDamage(t, boss.poison[3], boss.poison[2]);
      }
    }
    // 猛毒ダメージ。猛毒毒が入った瞬間を0fとすると初回167f目にダメ入る。60f間隔でダメージ。
    if (boss.very_poison[0] != ""&& boss.very_poison[0]+boss.very_poison[1]>t) {
      if ((t - boss.very_poison[0])%213 == 167) {
         addDamage(t, boss.very_poison[3], boss.very_poison[2]);
      }
    }
  }





  // 出力用計算(キャラ)
  function outputCharaCal(t, chara) {
    // 物理攻撃
    if (result_condition.method == 1) {
      if (result_condition.chara_atk == 1) {
        chara.output_atk.push([atkCal(t, chara)]);
      }
      if (result_condition.chara_cu == 1) {
        chara.output_cu.push([acuCal(t, chara)]);
      }
    }

    // 魔法攻撃
    if (result_condition.method == -1) {
      if (result_condition.chara_atk == 1) {
        chara.output_atk.push([matCal(t, chara)]);
      }
      if (result_condition.chara_cu == 1) {
        chara.output_cu.push([mcuCal(t, chara)]);
      }
    }


    // どちらでも
    if (result_condition.chara_sp == 1) {
      chara.output_sp.push([speedCal(t, chara)]);
    }
    if (result_condition.chara_tp == 1) {
      chara.output_tp.push([chara.tp]);
    }
    if (result_condition.chara_tpu == 1) {
      chara.output_tpu.push([tpuCal(t, chara)]);
    }
    if (result_condition.chara_moob == 1) {
      if (chara.moob_onoff == 1) {
        chara.output_moob.push([chara.moob_array[chara.moob_count]]);
      } else {
        chara.output_moob.push([""]);
      }
    }

  }

  //出力用(ボス)
  function outputBossCal(t, boss) {
    // キャラが物理
    if (result_condition.method == 1) {
      if (result_condition.boss_def == 1) {
        boss.output_def.push([defCal(t, boss)]);
      }
    }

    // キャラが魔法
    if (result_condition.method == -1) {
      if (result_condition.boss_def == 1) {
        boss.output_def.push([mdeCal(t, boss)]);
      }
    }
  }


  function output() {
     // 簡易ダメージ表示の配列作成
    result[0] = sumDamage(boss.total_damage_array);
    for (let i=0; i<chara_array.length; i++) {
      result[6 - chara_array[i].index] = sumDamage(chara_array[i].total_damage_array);
    }

    // クリア
    sheet_2.getRange(4, 1, 300, 10).clear();

    //出力(シート「メイン」へ簡易ダメージを出力)
    sheet_1.getRange(5,16,1,6).setValues([result]);
    sheet_1.getRange(6,17).setValue(total_damage);


    //出力(シート「結果」へキャラに関する)
    for (let n=0; n<chara_array.length; n++) {

      if (chara_array[n].total_damage_array.length > 0) {
        sheet_2.getRange(4, 11-2*chara_array[n].index, chara_array[n].total_damage_array.length, 2).setValues(chara_array[n].total_damage_array);
      }

      if (result_condition.chara_moob == 1) {
        sheet_3.getRange(5, 39-7*chara_array[n].index, 5400, 1).setValues(chara_array[n].output_moob);
      }
      if (result_condition.chara_atk == 1) {
        sheet_3.getRange(5, 40-7*chara_array[n].index, 5400, 1).setValues(chara_array[n].output_atk);
      }
      if (result_condition.chara_cu == 1) {
        sheet_3.getRange(5, 41-7*chara_array[n].index, 5400, 1).setValues(chara_array[n].output_cu);
      }
      if (result_condition.chara_sp == 1) {
        sheet_3.getRange(5, 42-7*chara_array[n].index, 5400, 1).setValues(chara_array[n].output_sp);
      }
      if (result_condition.chara_tp == 1) {
        sheet_3.getRange(5, 43-7*chara_array[n].index, 5400, 1).setValues(chara_array[n].output_tp);
      }
      if (result_condition.chara_tpu == 1) {
        sheet_3.getRange(5, 44-7*chara_array[n].index, 5400, 1).setValues(chara_array[n].output_tpu);
      }
    }

    //「結果」(ボス)
    boss.output_def[0] = [boss.silver_def];
    if (result_condition.boss_def == 1) {
      sheet_3.getRange(5, 39, 5400, 1).setValues(boss.output_def);
    }



  }

  // 値を初期化する
  function reset() {
    condition.tl_3_count = 0;
    condition.bind_tl_count = 0;

    total_damage = 0;

    boss.buff_atk = [];
    boss.buff_mat = [];
    boss.buff_def = [];
    boss.buff_mde = [];

    boss.buff_sc = [];
    boss.buff_sac = [];
    boss.buff_smc = [];

    boss.buff_sau = [];
    boss.buff_smu = [];

    // 状態異常系(毒、猛毒)
    poison = [];
    very_poison = [];



    for (let i=0; i<chara_array.length; i++) {
      chara_array[i].buff_atk = [];
      chara_array[i].buff_mat = [];
      chara_array[i].buff_def = [];
      chara_array[i].buff_mde = [];
      chara_array[i].buff_acr = [];
      chara_array[i].buff_mcr = [];
      chara_array[i].buff_tpu = [];
      chara_array[i].buff_speed = [[0, 0, 0, 0]];
      chara_array[i].buff_speed_karin = [];
      chara_array[i].buff_hp = [];
      chara_array[i].buff_acu = [];
      chara_array[i].buff_mcu = [];

      chara_array[i].tp = 0;
      chara_array[i].moob_count = -1;
      chara_array[i].moob_onoff = 0;
      chara_array[i].start_time = chara_array[i].start_time_original;
      chara_array[i].end_time = chara_array[i].start_time_original - 1;
      chara_array[i].wait_time = 100;

      chara_array[i].bind = 0;
      chara_array[i].speed = 0;
      chara_array[i].total_damage_array = [];
      chara_array[i].damage_array = [];

    }
  }



  // ゲーム部分
  function game() {
    for (let t = 0; t<5400; t++) {

    for (let n=0; n<chara_array.length; n++) {
       moob(t, chara_array[n]);
    }

    if (condition.bind_onoff) {
      tlBind(t, chara_array);
    }

    tl(t, chara_array, boss);

    for (let n=0; n<chara_array.length; n++) {
      outputCharaCal(t, chara_array[n]);
    }

    bossContinue(t, boss);
    outputBossCal(t, boss);
  　}
  }









  //===================================================================================================
  // 実際に稼働している部分
  if (condition.randam_onoff) {
    for (let i=0; i<chara_array.length; i++) {
      chara_array[i].cr_type = 3;
    }

    for (let i=0; i<10000; i++) {
      game();
      randam_result.push([total_damage]);

      reset();
    }

    sheet_5.getRange(1, 1, 10000, 1).setValues(randam_result);
  } else {
    game();
    output();
  }

  console.log();






































  // =======================計算系=============================

  // ダメージ計算(クリティカルは期待値)
  function damageCal(t, chara, boss, skill_lv, skill_rate, rate, hit, cr_magnification) {
    let attack = 0;
    let defence = 0;
    let cr = criticalRate(t, chara, boss);
    let critical_up = 0;
    let critical_s_up = 0;
    let s_up = 0;
    let damage_array = [];
    let damage_expected = [];

    // クリティカル率のカスタマイズ
    switch(chara.cr_type) {
      case 1:
        cr = 1;
        break;
      case 2:
        if (cr !== 1) {
          cr = 0;
        }
        break;
    }


    // キャラ特有のステータス
    // カオリの精神統一によるダメージ上昇
    let damage_kaori = 0;
    // 聖ユニのs1みたいな物理魔法被クリダメアップ
    let critical_s_up_seiyuni = buffCal(t, 0, boss.buff_sc);


    // 物理魔法仕分け
    if (chara.type == 1) {
      attack = atkCal(t, chara);
      defence = defCal(t, boss);
      critical_up = acuCal(t, chara);
      critical_s_up = buffCal(t, 0, boss.buff_sac);
      s_up = buffCal(t, 0, boss.buff_sau);
    } else if (chara.type == -1) {
      attack = matCal(t, chara);
      defence = mdeCal(t, boss);
      critical_up = mcuCal(t, chara);
      critical_s_up = buffCal(t, 0, boss.buff_smc);
      s_up = buffCal(t, 0, boss.buff_smu);
    }

    if (cr_magnification == undefined){
      cr_magnification = 2;
    }








    // リトリリの防御力判定
    if (chara.num == 7) {
      if (chara.litlyli_onoff == 1) {
        if (defCal(t, boss) > mdeCal(t, boss)) {
          defence = mdeCal(t, boss);
        }
      }
    }





    for (let n=0; n<hit.length+1; n++) {


      for (let i=0; i<hit.length; i++) {
        // カオリのダメージ上昇計算
        if (chara.num == 2) {
          damage_kaori = chara.count_kaori*10*(1+chara.s2_lv);
        }

        let damage = (skill_rate*(1+ skill_lv) + attack*rate)*hit[i]/sum(hit) + damage_kaori;
        damage = round_1(damage, rate*hit[i]/sum(hit));
        // クリティカルの有無
        if (chara.cr_type >= 1) {
          if (cr >= Math.random()) {
            damage = damage*cr_magnification*(1+critical_up)*(1+critical_s_up)*(1+critical_s_up_seiyuni)*(1+s_up);
          } else {
            damage = damage*(1+s_up);
          }
        } else {
          if (i<n) {
            damage = damage*cr_magnification*(1+critical_up)*(1+critical_s_up)*(1+critical_s_up_seiyuni)*(1+s_up);
          } else {
            damage = damage*(1+s_up);
          }
        }


        damage = damage/(1+defence/100);
        damage = round_1(damage, rate*hit[i]/sum(hit));


        damage_array.push(damage);

        //　カオリのカウント進める
        if (chara.num == 2) {
          kaoriCount(chara);
        }
      }


      let damage_sum = sum(damage_array);

      for (let i=0; i<damage_array.length; i++) {
        if (condition.logBarrier_onoff) {
          damage_array[i] = damage_array[i]*logBarrier(damage_sum)/damage_sum;
          damage_array[i] = round_1(damage_array[i], rate*hit[i]/sum(hit));
        }

        if (damage_array[i] > 999999) {
          damage_array[i] = 999999;
        }
      }


      if (chara.cr_type >= 1) {
        break;
      } else {
        damage_expected.push(damage_array);
        damage_array = [];
      }


    }

  if (chara.cr_type >= 1) {
    chara.damage_array = damage_array;
  } else {
    let sum_damge_expected = 0;
    for (let m=0; m<hit.length+1; m++) {
      sum_damge_expected += sum(damage_expected[m])*((1-cr)**(hit.length-m))*(cr**m)*combination(hit.length, m);
    }
    damage_array = new Array(hit.length);
    damage_array.fill(Math.floor(sum_damge_expected/hit.length));

    chara.damage_array = damage_array;


    console.log(damage_array);


  }










    return chara.damage_array;
  }


  // ログバリア
  function logBarrier(damage) {
    if (damage>850000) {
      damage = 100000*Math.log((damage - 850000)/100000 + 1) + 850000;
    }
    return damage;
  }





  // ダメージを与える処理
  function addDamage(t, chara, damage) {
    chara.total_damage_array.push([t, damage]);
    total_damage += damage;
  }


  // クリティカル率の計算
  function criticalRate(t, chara, boss) {
    let critical = 0;
    if (chara.type == 1) {
      critical = acrCal(t, chara);
    } else if (chara.type == 2) {
      critical = mcrCal(t, chara);
    }


    let critical_rate = critical/2000*chara.lv/boss.lv;
    if (critical_rate >1) {
      return 1;
    } else {
      return critical_rate;
    }

  }









  // バフを追加する(単体)
  function buffAdd(buff_start_time, buff_Array, buff_type, effect_time, buff) {
    buff_Array.push([buff_start_time, buff_type, effect_time, buff]);
  }


  // バフを追加する(味方全体)
  function buffAddMulti(type, buff_start_time, chara_buff_array, buff_type, effect_time, buff) {
     switch (type){
        case 0:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_atk.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 1:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_def.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 2:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_mat.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 3:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_mde.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 4:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_acr.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 5:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_mcr.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 6:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_acu.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 7:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_mcu.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 8:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_tpu.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 9:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_speed.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
        case 10:
          for (let i=0; i<chara_buff_array.length; i++) {
            chara_buff_array[i].buff_speed_karin.push([buff_start_time, buff_type, effect_time, buff]);
          }
          break;
      }

  }



  // バフ計算
  function buffCal(t, before_status, buff_Array) {
    let after_status = before_status;

    for (let n=0; n<buff_Array.length; n++) {
      if (buff_Array[n][0] + buff_Array[n][2] > t) {
        // 1: 加算
        if (buff_Array[n][1] == 1) {
          after_status += buff_Array[n][3];
        }
        // 2: 割合加算
        if (buff_Array[n][1] == 2) {
          after_status += Math.ceil(before_status*buff_Array[n][3]);
        }
      }
    }

    if (after_status < 0) {
      after_status = 0;
    }

    return after_status;
  }






  // tp付与計算
  function addTp(t, chara, tp) {
    chara.tp += tp*(1+tpuCal(t, chara)/100);
    chara.tp = Math.floor(chara.tp*100)/100;
    if (chara.tp > 1000) {
      chara.tp = 1000;
    }
  }

  // tp付与計算(複数キャラ)
  function addTpMulti(t, chara_tp_array, tp) {
    for (let m=0; m<chara_tp_array.length; m++) {
      addTp(t, chara_tp_array[m], tp);
    }
  }





  // それぞれのステータスの計算
  function atkCal(t, chara) {
    return buffCal(t, chara.atk, chara.buff_atk);
  }

  function defCal(t, chara) {
    let def = buffCal(t, chara.def, chara.buff_def);

    if (chara.silver_def != undefined) {
      def += chara.silver_def;
    }
    return def;
  }

  function matCal(t, chara) {
    return buffCal(t, chara.mat, chara.buff_mat);
  }

  function mdeCal(t, chara) {
    let mde = buffCal(t, chara.mde, chara.buff_mde);
    if (chara.silver_mde != undefined) {
      mde += chara.silver_mde;
    }
    return mde;
  }

  function acrCal(t, chara) {
    return buffCal(t, chara.acr, chara.buff_acr);
  }

  function mcrCal(t, chara) {
    return buffCal(t, chara.mcr, chara.buff_mcr);
  }

  function acuCal(t, chara) {
    return buffCal(t, 0, chara.buff_acu);
  }

  function mcuCal(t, chara) {
    return buffCal(t, 0, chara.buff_mcu);
  }

  // 上限250(キャラの場合)
  function tpuCal(t, chara) {
    let tpu = buffCal(t, chara.tpu, chara.buff_tpu);
    if (tpu > 250 && chara.num<1000) {
      tpu = 250;
    }
    return tpu;
  }

  // 速度バフ(カリンタイプも実装)
  function speedCal(t, chara) {
    let speed_buff = 0;

    if (chara.buff_speed.slice(-1)[0][0] + chara.buff_speed.slice(-1)[0][2] > t) {
      speed_buff = chara.buff_speed.slice(-1)[0][3];
    }

    speed_buff += buffCal(t, 0, chara.buff_speed_karin);

    return speed_buff;
  }

  // UB
  function ub(t, chara, boss) {
    if (tl_type != 3) {
      if (chara.bind < t) {
        database[chara.num-1].ub(t,chara, boss);
        chara.tp = chara.tpr*10;
        bind(t, chara, chara.ub_bind_time);
      }
    } else {
      database[chara.num-1].ub(t,chara, boss);
      chara.tp = chara.tpr*10;
      bind(t, chara, chara.ub_bind_time);
    }
  }




  // 拘束処理
  function bind(t, chara, bind_time) {
    if (chara.moob_onoff == 0) {
      chara.wait_time += bind_time;
    }
    else {
      moobEnd(t, chara);
      chara.start_time += bind_time;
    }
    chara.bind = t + bind_time;
  }



  //========================キャラのスキルのモジュール===================================


  // 行動の最初に待機時間を計算するもの()
  function waitCal(t, chara, time) {
    if (t == chara.end_time + 1) {
      chara.wait_time = Math.ceil(time/(1+chara.speed));
    }
  }

  // 行動終了後に行う、次の行動の時刻を記憶する
  function moobEnd(t,chara) {
    chara.start_time = t+1;
    chara.end_time = t;
  }

  //UB後のTP計算およびmoobEndとUB硬直の処理
  function ubEnd(t, chara) {
    chara.tp = chara.tpr*10;
    if (chara.moob_onoff == 1) {
      moobEnd(t, chara);
      chara.start_time += chara.ub_bind_time;
    } else {
      chara.wait_time += chara.ub_bind_time;
    }

  }

  // ダメージの端数処理1(防御計算前)
  function round_1(damage, rate) {
    let check = 1 - rate/2;
    let fraction = damage - Math.floor(damage);

    if (check < fraction) {
      damage = Math.ceil(damage);
    } else {
      damage = Math.floor(damage);
    }
    return damage;
  }

  // キャラ別のダメージ合計
  function sumDamage(array) {
   return  array.reduce((sum, element) => sum + element[1], 0);
  }


  // 配列から一つ排除する
  function exceptArray(array, chara) {
    return array.filter((element) => element !== chara )
  }

  // 最もステータスが高いキャラを選ぶ
  function mostChara(t, type, chara_array) {
    let check_array = []
    switch (type) {
      case 0:
        for (let i=0; i<chara_array.length; i++) {
          check_array.push(atkCal(t, chara_array[i]));
        }
        break;
    }

    return chara_array[maxIndex(check_array)];
  }








  //========================キャラの特有のスキルのモジュール===================================

  // カオリの精神統一カウント
  function kaoriCount(chara) {
    if (chara.count_kaori < 5) {
      chara.count_kaori++;
    }
  }





















  // =============================その他============================

  // 二次元配列行列入れ替え
  function replace(arrayBefore) {
    var arrayAfter = [];

    for (let i=0; i<arrayBefore[0].length; i++){
      arrayAfter.push([]);
      for (let j=0; j<arrayBefore.length; j++){
        arrayAfter[i].push(arrayBefore[j][i]);
      }
    }

    return arrayAfter
  }


  // 行動配列作成
  function moobArraymaker(initialAction, roopAction) {
    let moobArray = initialAction;
    for (let i=0; i<100/(roopAction.length); i++){
      moobArray = moobArray.concat(roopAction);
    }
    return moobArray;
  }

  // 配列の合計値を出す
  function sum(array) {
   return  array.reduce((sum, element) => sum + element, 0);
  }

  // 配列の最大値を持つindexを返す
  function maxIndex(array) {
    let max_value = array[0];
    let max_index = 0;
    for (let n=0; n<array.length; n++) {
      if (max_value < array[n]) {
        max_value = array[n];
        max_index = n;
      }
    }
    return max_index;
  }

  //　コンビネーションの数字を計算
  function combination(n, k) {
    let num = 1;
    while (k>0) {
      num = num*n/k;
      n--;
      k--;
    }
    return num;
  }


}










//クリア

function resultClear () {
  const sheet_2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("計算貼り付け");
  const sheet_3 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("結果");

  sheet_2.getRange(4, 1, 300, 10).clear();
  sheet_3.getRange(5, 4, 5400, 6).clearContent();
  sheet_3.getRange(5, 11, 5400, 6).clearContent();
  sheet_3.getRange(5, 18, 5400, 6).clearContent();
  sheet_3.getRange(5, 25, 5400, 6).clearContent();
  sheet_3.getRange(5, 32, 5400, 6).clearContent();
  sheet_3.getRange(5, 39, 5400, 4).clearContent();
}
