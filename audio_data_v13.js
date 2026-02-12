const audioData = [
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656762/20180504%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E8%AE%B2%E7%A5%9E%E9%80%9A%E7%9A%84%E7%89%B9%E5%BE%81_fsuy1r.wav",
        title: "20180504 谛深大师讲神通的特征"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656744/20181223%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E8%AE%B2%E5%AD%A9%E5%AD%90%E6%95%99%E8%82%B2_2_%E5%AD%A6%E4%BD%9B%E4%BA%BA%E7%94%9F%E7%97%85%E8%A6%81%E5%90%83%E8%8D%AF_%E8%8D%AF%E5%8C%BA_nh8ddc.mp3",
        title: "20181223 谛深大师讲孩子教育(2)：学佛人生病要吃药、药区"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656731/20180318%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E9%BE%99%E5%8F%A3%E5%85%B1%E4%BF%AE%E7%BB%84%E5%BC%80%E7%A4%BA_%E4%B8%8B_ddstnn.wav",
        title: "20180318 谛深大师给龙口共修组开示(下)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656718/%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E9%BE%99%E5%8F%A3%E5%85%B1%E4%BF%AE%E7%BB%84%E5%BC%80%E7%A4%BA_1_2018.4.22_cg1dvw.wav",
        title: "20180422 谛深大师给龙口共修组开示(1)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656708/20180324-1%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E6%83%B3%E6%B3%95%E6%80%8E%E4%B9%88%E6%9D%A5%E7%9A%84_%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%92%8C%E4%BA%BA_%E9%98%8E%E7%BD%97%E6%AE%BF_%E6%A2%A6%E6%98%AF%E4%BB%80%E4%B9%88_fglgry.mp3",
        title: "20180324 师父开示：想法怎么来的、计算机和人、阎罗殿、梦是什么"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656699/20191229%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E4%BD%9B%E9%97%A8%E7%AB%8B%E5%8A%9F%E5%BE%B7%E7%A2%91%E7%9A%84%E4%BD%9C%E7%94%A8_jarefk.mp3",
        title: "20191229 谛深大师开示：佛门立功德碑的作用"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656672/20190321%E6%AF%8F%E4%B8%AA%E4%BA%BA%E9%83%BD%E5%BA%94%E8%AF%A5%E5%90%AC%E5%90%AC%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E8%BF%99%E4%B8%AA%E5%BC%80%E7%A4%BA_vnihww.mp3",
        title: "20190321 每个人都应该听听谛深大师这个开示"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656662/20200209%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E7%97%85%E6%98%AF%E6%80%8E%E4%B9%88%E6%9D%A5%E7%9A%841_dswydp.mp3",
        title: "20200209 谛深大师开示：病是怎么来的(1)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656660/20200227%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E5%81%9A%E5%8A%9F%E5%BE%B7%E8%83%BD%E8%8E%B7%E5%BE%97%E7%A5%9E%E9%80%9A_jlebzs.mp3",
        title: "20200227 谛深大师开示：做功德能获得神通"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656659/20200123_%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E4%B8%BA%E4%BB%80%E4%B9%88%E7%8A%AF%E5%9B%B0_w7bjse.mp3",
        title: "20200123 谛深大师开示：为什么犯困"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656657/20200301%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E6%8A%A5%E6%98%AF%E6%80%8E%E4%B9%88%E4%BD%93%E7%8E%B0%E7%9A%84_yedqkx.mp3",
        title: "20200301 谛深大师开示：报是怎么体现的"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656616/20180331%E5%B8%88%E7%88%B6%E7%BB%99%E5%AE%81%E6%B3%A2%E5%85%B1%E4%BF%AE%E7%9A%84%E5%BC%80%E7%A4%BA2_swmomr.mp3",
        title: "20180331 师父给宁波共修的开示(2)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656592/20170928_%E9%A1%BB%E5%BC%A5%E5%B1%B1%E5%A4%A7%E5%AD%A6_qfidy1.mp3",
        title: "20170928 须弥山大学"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656583/2018318%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E9%BE%99%E5%8F%A3%E5%85%B1%E4%BF%AE%E7%BB%84%E5%BC%80%E7%A4%BA_%E4%B8%8A_jbq9kz.wav",
        title: "20180318 谛深大师给龙口共修组开示(上)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656565/%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA%E9%9F%B3%E9%A2%91_%E4%B8%8D%E8%A6%81%E6%84%9A%E7%97%B4_%E4%BF%AE%E8%A1%8C%E8%A6%81%E4%BF%AE%E8%AF%81%E4%BA%86%E4%B9%89_%E5%B8%88%E7%88%B6%E5%87%BA%E4%B8%96%E6%89%93%E7%9A%84%E5%B0%B1%E6%98%AF%E9%AD%94%E7%8E%8B_%E6%89%93%E7%9A%84%E5%B0%B1%E6%98%AF%E9%82%AA%E9%AD%94%E5%A4%96%E9%81%93_uyriu4.mp3",
        title: "谛深大师开示音频：不要愚痴、修行要修证了义、师父出世打的就是魔王、打的就是邪魔外道"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656484/20200218%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E7%9C%9F%E7%9A%84%E6%9C%89%E4%BA%BA%E6%98%AF%E6%96%87%E6%9B%B2%E6%98%9F%E4%B8%8B%E5%87%A1%E5%90%97_dkdnit.mp3",
        title: "20200218 谛深大师开示：真的有人是文曲星下凡吗"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656474/20200215%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E8%B7%AA%E9%A6%99_jbxv2a.mp3",
        title: "20200215 谛深大师开示：跪香"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656431/20200121_%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E7%BD%91%E4%B8%8A%E8%B5%8C%E5%8D%9A%E5%81%9A%E4%BE%9B%E5%85%BB%E6%9C%89%E6%B2%A1%E6%9C%89%E5%8A%9F%E5%BE%B7_x8ip4i.mp3",
        title: "20200121 谛深大师开示：网上赌博做供养有没有功德"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656403/20190607%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E5%BE%8B%E8%97%8F%E6%A0%B9%E6%9C%AC_%E8%AF%86%E5%BF%83%E8%A6%81%E4%B9%89_b1l1wp.mp3",
        title: "20190607 谛深大师开示：律藏根本、识心要义"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656402/20191009%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E5%9B%9E%E5%90%91_ck3iec.mp3",
        title: "20191009 谛深大师开示：回向"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656399/20190211_%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E4%BD%9B%E6%B3%95%E4%B8%8D%E6%98%AF%E5%85%B1%E9%B8%A3_j20umg.mp3",
        title: "20190211 谛深大师开示：佛法不是共鸣"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656385/20190204%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_1_%E7%9D%80%E9%AD%94%E6%B3%95_vopso0.mp3",
        title: "20190204 谛深大师开示(1)：着魔法"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656382/20190204%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_2_%E5%A6%82%E4%BD%95%E8%84%B1%E7%A6%BB%E9%AD%94%E9%81%93_t5epa9.mp3",
        title: "20190204 谛深大师开示(2)：如何脱离魔道"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656369/20181223%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA%E5%AD%A9%E5%AD%90%E6%95%99%E8%82%B2_1_p4gfey.mp3",
        title: "20181223 谛深大师开示孩子教育(1)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656362/20190120%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_2_%E6%B7%AB%E5%BF%83%E5%92%8C%E4%B8%8D%E6%B7%AB%E6%88%92_txabm2.mp3",
        title: "20190120 谛深大师给扬州共修开示(2)：淫心和不淫戒"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656357/20190115%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E4%BD%9B%E6%B3%95%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E4%BC%A0%E6%89%BF_qrh9oq.mp3",
        title: "20190115 谛深大师开示：佛法为什么要传承"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656337/20181203%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA_%E4%BB%80%E4%B9%88%E6%98%AF%E5%A4%A9_%E4%BF%AE%E8%A1%8C%E4%B8%8D%E8%A6%81%E6%9C%89%E7%8B%82%E5%BF%83_cwtme7.mp3",
        title: "20181203 谛深大师开示：什么是天、修行不要有狂心"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656336/20181129_%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA%E5%AD%A6%E5%A4%A7%E4%B9%98%E7%9A%84%E5%9F%BA%E7%A1%80_w9sg2j.mp3",
        title: "20181129 谛深大师开示：学大乘的基础"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656336/20181222%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_4_%E5%BC%9F%E5%AD%90%E9%97%AE%E7%87%83%E6%8C%87%E4%BE%9B%E4%BD%9B_%E9%82%AA%E9%81%93%E5%85%89%E7%9B%98%E5%A4%84%E7%90%86_alig9w.mp3",
        title: "20181222 谛深大师给扬州共修开示(4)：弟子问燃指供佛、邪道光盘处理"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656334/20181222%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_3_%E6%84%8F%E8%AF%86%E8%BA%AB_%E7%9C%9F%E7%9A%88%E4%BE%9D%E4%BD%9B%E5%B0%B1%E6%98%AF%E6%88%90%E5%B0%B1_nwnhqo.mp3",
        title: "20181222 谛深大师给扬州共修开示(3)：意识身、真皈依佛就是成就"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656331/20181222%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_2_%E6%8B%9C%E4%BD%9B%E4%B9%8B%E5%BF%83%E5%BF%B5_%E5%81%9A%E5%8A%9F%E8%AF%BE%E7%AB%99%E5%9C%B0%E8%A7%84%E7%9F%A9_clo2qw.mp3",
        title: "20181222 谛深大师给扬州共修开示(2)：拜佛之心念、做功课站地规矩"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656328/20181129_%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E5%BC%80%E7%A4%BA%E5%A4%A7%E4%B9%98%E5%92%8C%E5%B0%8F%E4%B9%98_dpgqac.mp3",
        title: "20181129 谛深大师开示：大乘和小乘"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656327/20181222%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_1_%E5%BA%94%E4%BF%AE%E6%85%88%E6%82%B2_%E4%BC%A0%E6%B3%95%E6%9D%A1%E4%BB%B6_%E5%A4%A7%E9%98%BF%E7%BD%97%E6%B1%89%E4%B8%8E%E8%8F%A9%E8%90%A8%E5%8C%BA%E5%88%AB_%E5%AF%BF%E9%87%8F_%E5%BC%80%E6%82%9F%E6%98%8E%E8%AF%B8%E7%9B%B8%E4%B9%89_yaci6u.mp3",
        title: "20181222 谛深大师给扬州共修开示(1)：应修慈悲、传法条件等"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656318/20181111%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_2_%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E5%AD%A6%E4%BD%9B%E4%B8%8E%E5%AE%B6%E4%BA%BA%E5%8F%8D%E5%AF%B9%E4%B9%8B%E7%9F%9B%E7%9B%BE_%E5%8F%8D%E5%AF%B9%E5%8E%9F%E5%9B%A0%E5%8F%8A%E5%A6%82%E4%BD%95%E9%99%8D%E4%BC%8F%E4%BB%96%E4%BB%AC_xg5lpg.mp3",
        title: "20181111 谛深大师给扬州共修开示(2)：如何处理学佛与家人反对之矛盾"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656310/20181111%E8%B0%9B%E6%B7%B1%E5%A4%A7%E5%B8%88%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E5%BC%80%E7%A4%BA_1_%E5%8A%9F%E5%BE%B7%E4%B8%8E%E5%BF%B5%E4%BD%9B%E5%8F%82%E7%A6%85%E4%BF%AE%E8%A1%8C%E5%8A%9F%E7%94%A8%E4%B9%8B%E5%88%AB_q4csrd.mp3",
        title: "20181111 谛深大师给扬州共修开示(1)：功德与念佛参禅修行功用之别"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656303/20180407%E5%B8%88%E7%88%B6%E7%BB%99%E5%8C%97%E4%BA%AC%E5%85%B1%E4%BF%AE%E7%BB%84%E7%9A%84%E5%BC%80%E7%A4%BA1_uiyvtz.mp3",
        title: "20180407 师父给北京共修组的开示(1)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656297/20180407%E5%B8%88%E7%88%B6%E7%BB%99%E5%8C%97%E4%BA%AC%E5%85%B1%E4%BF%AE%E7%BB%84%E7%9A%84%E5%BC%80%E7%A4%BA2_jbn6tt.mp3",
        title: "20180407 师父给北京共修组的开示(2)"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656258/20180324%E5%B8%88%E7%88%B6%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E8%AE%B2%E6%B3%951_%E5%B0%8F%E7%97%85%E4%B8%8D%E8%A6%81%E6%B1%82%E5%B8%88%E7%88%B6%E7%94%A8%E4%BF%AE%E8%A1%8C%E4%BA%86%E5%8D%B4_%E5%AF%BA%E9%99%A2_%E5%85%B1%E4%BF%AE_%E5%B0%98%E4%B8%96%E5%A6%82%E4%BD%95%E4%BF%AE%E7%AD%89_zmd21l.mp3",
        title: "20180324 师父给扬州共修讲法(1)：小病不要求师父用修行了却等"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656252/20180324%E5%B8%88%E7%88%B6%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E8%AE%B2%E6%B3%953_%E5%90%AC%E5%B8%88%E7%88%B6%E5%BC%80%E7%A4%BA%E6%9C%89%E6%81%AD%E6%95%AC%E5%BF%83%E5%8F%AF%E7%9B%B4%E6%8E%A5%E5%8F%97%E6%B3%95_%E4%BF%AE%E5%BE%97%E4%BD%9B%E6%B3%95_hkoww0.mp3",
        title: "20180324 师父给扬州共修讲法(3)：听师父开示有恭敬心可直接受法"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656241/20180324%E5%B8%88%E7%88%B6%E7%BB%99%E6%89%AC%E5%B7%9E%E5%85%B1%E4%BF%AE%E8%AE%B2%E6%B3%952_%E4%B8%B4%E7%BB%88%E5%8A%A9%E5%BF%B5%E5%8F%AA%E5%A2%9E%E7%A6%8F%E6%8A%A5_ooruso.mp3",
        title: "20180324 师父给扬州共修讲法(2)：临终助念只增福报"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656233/2022.10.4%E6%99%BA%E7%A6%85%E5%8D%B0%E9%9A%8F%E5%B8%88%E4%BF%AE%E8%A1%8C%E8%8E%B7%E5%BE%97_popedr.mp3",
        title: "20221004 智禅印随师修行获得"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656231/20170711_%E6%9F%93%E6%B1%A1_%E7%96%91%E6%83%91_%E5%9D%8F%E4%BA%BA_ks7pzk.mp3",
        title: "20170711 染污、疑惑、坏人"
    }
];