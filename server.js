const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════
// LOCATIONS DATABASE
// ═══════════════════════════════════════════════════
const LOCS = [
  {id:1, n:"Praha – Staré Město",        la:50.0873,lo:14.4208,h:180,cat:"city"},
  {id:2, n:"Praha – Žižkov",             la:50.0875,lo:14.4611,h:90, cat:"city"},
  {id:3, n:"Praha – Vinohrady",          la:50.0750,lo:14.4400,h:270,cat:"city"},
  {id:4, n:"Brno – centrum",             la:49.1953,lo:16.6078,h:45, cat:"city"},
  {id:5, n:"Ostrava – centrum",          la:49.8347,lo:18.2820,h:270,cat:"city"},
  {id:6, n:"Plzeň – nám. Republiky",    la:49.7475,lo:13.3776,h:0,  cat:"city"},
  {id:7, n:"Liberec – centrum",          la:50.7697,lo:15.0581,h:180,cat:"city"},
  {id:8, n:"Olomouc – Horní náměstí",  la:49.5955,lo:17.2519,h:90, cat:"city"},
  {id:9, n:"České Budějovice",          la:48.9747,lo:14.4747,h:0,  cat:"city"},
  {id:10,n:"Hradec Králové",             la:50.2092,lo:15.8328,h:270,cat:"city"},
  {id:11,n:"Pardubice",                  la:50.0375,lo:15.7808,h:180,cat:"city"},
  {id:12,n:"Karlovy Vary – kolonáda",  la:50.2292,lo:12.8739,h:0,  cat:"city"},
  {id:13,n:"Zlín – centrum",             la:49.2270,lo:17.6677,h:180,cat:"city"},
  {id:14,n:"Jihlava",                    la:49.3961,lo:15.5913,h:90, cat:"city"},
  {id:15,n:"Kutná Hora",                 la:49.9483,lo:15.2681,h:90, cat:"town"},
  {id:16,n:"Český Krumlov",              la:48.8128,lo:14.3175,h:0,  cat:"town"},
  {id:17,n:"Tábor",                      la:49.4147,lo:14.6622,h:180,cat:"town"},
  {id:18,n:"Třebíč",                     la:49.2147,lo:15.8794,h:0,  cat:"town"},
  {id:19,n:"Kroměříž",                   la:49.2967,lo:17.3942,h:90, cat:"town"},
  {id:20,n:"Písek",                      la:49.3093,lo:14.1469,h:270,cat:"town"},
  {id:21,n:"Cheb",                       la:50.0794,lo:12.3744,h:90, cat:"town"},
  {id:22,n:"Klatovy",                    la:49.3955,lo:13.2959,h:0,  cat:"town"},
  {id:23,n:"Náchod",                     la:50.4163,lo:16.1639,h:180,cat:"town"},
  {id:24,n:"Šumperk",                    la:49.9678,lo:16.9717,h:90, cat:"town"},
  {id:25,n:"Telč",                       la:49.1833,lo:15.4500,h:180,cat:"town"},
  {id:26,n:"Litomyšl",                   la:49.8680,lo:16.3133,h:0,  cat:"town"},
  {id:27,n:"Domažlice",                  la:49.4397,lo:12.9280,h:270,cat:"town"},
  {id:28,n:"Trutnov",                    la:50.5606,lo:15.9136,h:90, cat:"town"},
  {id:29,n:"Jičín",                      la:50.4356,lo:15.3606,h:0,  cat:"town"},
  {id:30,n:"Mikulov",                    la:48.8064,lo:16.6381,h:0,  cat:"town"},
  {id:31,n:"Znojmo",                     la:48.8553,lo:16.0486,h:180,cat:"town"},
  {id:32,n:"Mariánské Lázně",            la:49.9650,lo:12.7011,h:90, cat:"town"},
  {id:33,n:"Opava",                      la:49.9383,lo:17.9086,h:270,cat:"town"},
  {id:34,n:"Uherské Hradiště",           la:49.0706,lo:17.4594,h:0,  cat:"town"},
  {id:35,n:"Rožnov pod Radhoštěm",      la:49.4581,lo:18.1436,h:270,cat:"town"},
  {id:36,n:"Prostějov",                  la:49.4717,lo:17.1075,h:90, cat:"town"},
  {id:37,n:"Žďár nad Sázavou",           la:49.5628,lo:15.9389,h:0,  cat:"town"},
  {id:38,n:"Pelhřimov",                  la:49.4314,lo:15.2233,h:90, cat:"town"},
  {id:39,n:"Mělník",                     la:50.3508,lo:14.4761,h:270,cat:"town"},
  {id:40,n:"Litoměřice",                 la:50.5358,lo:14.1306,h:180,cat:"town"},
  {id:41,n:"Hluboká nad Vltavou",        la:49.0538,lo:14.4361,h:0,  cat:"village"},
  {id:42,n:"Lednice",                    la:48.7986,lo:16.8033,h:270,cat:"village"},
  {id:43,n:"Loket",                      la:50.1853,lo:12.7547,h:180,cat:"village"},
  {id:44,n:"Holašovice",                 la:48.9603,lo:14.3031,h:90, cat:"village"},
  {id:45,n:"Slavonice",                  la:49.0000,lo:15.3500,h:0,  cat:"village"},
  {id:46,n:"Valtice",                    la:48.7394,lo:16.7567,h:270,cat:"village"},
  {id:47,n:"Třeboň",                     la:49.0053,lo:14.7742,h:90, cat:"village"},
  {id:48,n:"Slavkov u Brna",             la:49.1533,lo:16.8794,h:0,  cat:"village"},
  // ── Hrady ──
  {id:49,n:"Karlštejn",la:49.9394,lo:14.1883,h:180,cat:"landmark"},
  {id:50,n:"Křivoklát",la:50.0375,lo:13.8714,h:90,cat:"landmark"},
  {id:51,n:"Bezděz",la:50.5317,lo:14.7108,h:200,cat:"landmark"},
  {id:52,n:"Kost",la:50.4972,lo:15.1869,h:270,cat:"landmark"},
  {id:53,n:"Trosky",la:50.5164,lo:15.2300,h:270,cat:"landmark"},
  {id:54,n:"Loket – hrad",la:50.1853,lo:12.7547,h:180,cat:"landmark"},
  {id:55,n:"Rábí",la:49.2647,lo:13.6078,h:90,cat:"landmark"},
  {id:56,n:"Buchlov",la:49.0789,lo:17.3189,h:140,cat:"landmark"},
  {id:57,n:"Bouzov",la:49.7100,lo:16.8906,h:180,cat:"landmark"},
  {id:58,n:"Pernštejn",la:49.4506,lo:16.3172,h:90,cat:"landmark"},
  {id:59,n:"Zvíkov",la:49.4631,lo:14.1917,h:0,cat:"landmark"},
  {id:60,n:"Helfštýn",la:49.5353,lo:17.6394,h:220,cat:"landmark"},
  {id:61,n:"Střekov",la:50.6608,lo:14.0503,h:270,cat:"landmark"},
  {id:62,n:"Houska",la:50.4889,lo:14.6256,h:180,cat:"landmark"},
  {id:63,n:"Landštejn",la:49.0414,lo:15.2836,h:90,cat:"landmark"},
  {id:64,n:"Kunětická Hora",la:50.0431,lo:15.8556,h:45,cat:"landmark"},
  {id:65,n:"Veveří",la:49.2306,lo:16.4956,h:270,cat:"landmark"},
  {id:66,n:"Český Šternberk",la:49.8078,lo:14.9269,h:270,cat:"landmark"},
  {id:67,n:"Kokořín",la:50.4358,lo:14.5775,h:0,cat:"landmark"},
  {id:68,n:"Lipnice nad Sázavou",la:49.6447,lo:15.4083,h:180,cat:"landmark"},
  {id:69,n:"Hukvaldy",la:49.6553,lo:18.2008,h:225,cat:"landmark"},
  {id:70,n:"Potštejn",la:50.1508,lo:16.2569,h:135,cat:"landmark"},
  {id:71,n:"Sloup v Čechách",la:50.6447,lo:14.5539,h:180,cat:"landmark"},
  {id:72,n:"Orlík nad Vltavou",la:49.5117,lo:14.1667,h:180,cat:"landmark"},
  {id:73,n:"Bítov",la:48.9525,lo:15.7197,h:90,cat:"landmark"},
  {id:74,n:"Točník",la:49.8858,lo:13.8769,h:225,cat:"landmark"},
  {id:75,n:"Přimda",la:49.6736,lo:12.6694,h:180,cat:"landmark"},
  {id:76,n:"Cheb – hrad",la:50.0797,lo:12.3700,h:270,cat:"landmark"},
  {id:77,n:"Boskovice – hrad",la:49.4883,lo:16.6611,h:90,cat:"landmark"},
  {id:78,n:"Jindřichův Hradec – hrad",la:49.1436,lo:15.0028,h:270,cat:"landmark"},
  {id:79,n:"Hradec nad Moravicí",la:49.8611,lo:17.8678,h:270,cat:"landmark"},
  {id:80,n:"Děčín – zámek",la:50.7772,lo:14.2153,h:180,cat:"landmark"},
  // ── Zámky ──
  {id:81,n:"Hluboká nad Vltavou – zámek",la:49.0522,lo:14.4414,h:180,cat:"landmark"},
  {id:82,n:"Lednice – zámek",la:48.8000,lo:16.8025,h:90,cat:"landmark"},
  {id:83,n:"Konopiště",la:49.7806,lo:14.6536,h:0,cat:"landmark"},
  {id:84,n:"Červená Lhota",la:49.1931,lo:14.8817,h:0,cat:"landmark"},
  {id:85,n:"Litomyšl – zámek",la:49.8694,lo:16.3147,h:270,cat:"landmark"},
  {id:86,n:"Kroměříž – zámek",la:49.2997,lo:17.3922,h:180,cat:"landmark"},
  {id:87,n:"Telč – zámek",la:49.1836,lo:15.4508,h:90,cat:"landmark"},
  {id:88,n:"Vranov nad Dyjí",la:48.8864,lo:15.8189,h:180,cat:"landmark"},
  {id:89,n:"Jaroměřice nad Rokytnou",la:49.0953,lo:15.8914,h:270,cat:"landmark"},
  {id:90,n:"Náměšť nad Oslavou",la:49.2075,lo:16.1575,h:90,cat:"landmark"},
  {id:91,n:"Valtice – zámek",la:48.7394,lo:16.7567,h:270,cat:"landmark"},
  {id:92,n:"Buchlovice",la:49.0853,lo:17.3469,h:90,cat:"landmark"},
  {id:93,n:"Rožmberk nad Vltavou",la:48.6583,lo:14.3644,h:315,cat:"landmark"},
  {id:94,n:"Kratochvíle",la:49.1100,lo:14.0264,h:180,cat:"landmark"},
  {id:95,n:"Nelahozeves",la:50.2639,lo:14.3069,h:0,cat:"landmark"},
  {id:96,n:"Mělník – zámek",la:50.3508,lo:14.4744,h:180,cat:"landmark"},
  {id:97,n:"Frýdlant – zámek",la:50.9208,lo:15.0817,h:90,cat:"landmark"},
  {id:98,n:"Sychrov",la:50.6458,lo:15.1300,h:0,cat:"landmark"},
  {id:99,n:"Hrádek u Nechanic",la:50.2742,lo:15.7428,h:180,cat:"landmark"},
  {id:100,n:"Opočno – zámek",la:50.2664,lo:16.1181,h:270,cat:"landmark"},
  {id:101,n:"Kynžvart",la:49.9914,lo:12.6219,h:90,cat:"landmark"},
  {id:102,n:"Kačina",la:49.9406,lo:15.3511,h:0,cat:"landmark"},
  {id:103,n:"Ploskovice",la:50.5328,lo:14.2078,h:90,cat:"landmark"},
  {id:104,n:"Častolovice",la:50.2197,lo:16.2108,h:0,cat:"landmark"},
  {id:105,n:"Velké Meziříčí – zámek",la:49.3553,lo:16.0094,h:270,cat:"landmark"},
  {id:106,n:"Náchod – zámek",la:50.4153,lo:16.1656,h:180,cat:"landmark"},
  // ── Kláštery a kostely ──
  {id:107,n:"Sedlec – kostnice",la:49.9608,lo:15.2819,h:90,cat:"landmark"},
  {id:108,n:"Loreta Praha",la:50.0883,lo:14.3906,h:90,cat:"landmark"},
  {id:109,n:"Strahov – klášter",la:50.0842,lo:14.3844,h:180,cat:"landmark"},
  {id:110,n:"Plasy – klášter",la:49.9342,lo:13.3967,h:270,cat:"landmark"},
  {id:111,n:"Vyšší Brod – klášter",la:48.6211,lo:14.3139,h:90,cat:"landmark"},
  {id:112,n:"Kladruby – klášter",la:49.6678,lo:12.9861,h:180,cat:"landmark"},
  {id:113,n:"Zlatá Koruna – klášter",la:48.8594,lo:14.3706,h:270,cat:"landmark"},
  {id:114,n:"Broumov – klášter",la:50.5864,lo:16.3350,h:90,cat:"landmark"},
  {id:115,n:"Chrám sv. Barbory – Kutná Hora",la:49.9467,lo:15.2628,h:180,cat:"landmark"},
  {id:116,n:"Bazilika sv. Prokopa – Třebíč",la:49.2158,lo:15.8828,h:90,cat:"landmark"},
  {id:117,n:"Zelená Hora – Žďár",la:49.5761,lo:15.9306,h:180,cat:"landmark"},
  // ── Jiné památky ──
  {id:118,n:"Karlův most – Praha",la:50.0865,lo:14.4114,h:270,cat:"landmark"},
  {id:119,n:"Vyšehrad",la:50.0647,lo:14.4181,h:0,cat:"landmark"},
  {id:120,n:"Petřín – rozhledna",la:50.0817,lo:14.3956,h:90,cat:"landmark"},
  {id:121,n:"Ještěd",la:50.7264,lo:14.9947,h:180,cat:"landmark"},
  {id:122,n:"Žižkovská věž",la:50.0797,lo:14.4511,h:0,cat:"landmark"},
  {id:123,n:"Kuks – hospitál",la:50.3939,lo:15.8889,h:180,cat:"landmark"},
  {id:124,n:"Špilberk – Brno",la:49.1944,lo:16.5989,h:0,cat:"landmark"},
  {id:125,n:"Holašovice",la:48.9603,lo:14.3031,h:90,cat:"landmark"},
  {id:126,n:"Chrám sv. Víta – Praha",la:50.0908,lo:14.4000,h:180,cat:"landmark"},
  {id:127,n:"Tvrz Žumberk",la:48.8742,lo:14.6503,h:135,cat:"landmark"},
  // ── Další města a obce (250+) ──
  {id:200,n:"Havlíčkův Brod",la:49.6081,lo:15.5800,h:47,cat:"town"},
  {id:201,n:"Přerov",la:49.4558,lo:17.4505,h:213,cat:"town"},
  {id:202,n:"Frýdek-Místek",la:49.6833,lo:18.3667,h:88,cat:"town"},
  {id:203,n:"Mladá Boleslav",la:50.4121,lo:14.9035,h:154,cat:"town"},
  {id:204,n:"Děčín",la:50.7729,lo:14.2152,h:302,cat:"town"},
  {id:205,n:"Ústí nad Labem",la:50.6607,lo:14.0323,h:19,cat:"city"},
  {id:206,n:"Teplice",la:50.6404,lo:13.8249,h:271,cat:"city"},
  {id:207,n:"Most",la:50.5028,lo:13.6363,h:134,cat:"city"},
  {id:208,n:"Chomutov",la:50.4608,lo:13.4178,h:55,cat:"city"},
  {id:209,n:"Kladno",la:50.1439,lo:14.1043,h:317,cat:"city"},
  {id:210,n:"Kolín",la:50.0264,lo:15.1999,h:189,cat:"town"},
  {id:211,n:"Příbram",la:49.6944,lo:14.0064,h:76,cat:"town"},
  {id:212,n:"Beroun",la:49.9608,lo:14.0695,h:223,cat:"town"},
  {id:213,n:"Rakovník",la:50.1059,lo:13.7352,h:340,cat:"town"},
  {id:214,n:"Sokolov",la:50.1804,lo:12.6390,h:107,cat:"town"},
  {id:215,n:"Chrudim",la:49.9505,lo:15.7958,h:258,cat:"town"},
  {id:216,n:"Svitavy",la:49.7569,lo:16.4680,h:31,cat:"town"},
  {id:217,n:"Ústí nad Orlicí",la:49.9729,lo:16.3943,h:195,cat:"town"},
  {id:218,n:"Vsetín",la:49.3394,lo:17.9983,h:144,cat:"town"},
  {id:219,n:"Uherský Brod",la:48.9974,lo:17.6477,h:267,cat:"town"},
  {id:220,n:"Hodonín",la:48.8518,lo:17.1321,h:83,cat:"town"},
  {id:221,n:"Břeclav",la:48.7567,lo:16.8820,h:359,cat:"town"},
  {id:222,n:"Vyškov",la:49.2761,lo:17.0079,h:126,cat:"town"},
  {id:223,n:"Blansko",la:49.3638,lo:16.6458,h:212,cat:"town"},
  {id:224,n:"Boskovice",la:49.4872,lo:16.6623,h:48,cat:"town"},
  {id:225,n:"Nový Jičín",la:49.5944,lo:18.0133,h:295,cat:"town"},
  {id:226,n:"Šternberk",la:49.7293,lo:17.2993,h:22,cat:"town"},
  {id:227,n:"Zábřeh",la:49.8797,lo:16.8715,h:318,cat:"town"},
  {id:228,n:"Hranice na Moravě",la:49.5489,lo:17.7192,h:140,cat:"town"},
  {id:229,n:"Krnov",la:49.9944,lo:17.7045,h:237,cat:"town"},
  {id:230,n:"Bruntál",la:49.9882,lo:17.4646,h:109,cat:"town"},
  {id:231,n:"Valašské Meziříčí",la:49.4722,lo:17.9716,h:27,cat:"town"},
  {id:232,n:"Otrokovice",la:49.2108,lo:17.5331,h:74,cat:"town"},
  {id:233,n:"Kyjov",la:49.0088,lo:17.1237,h:318,cat:"town"},
  {id:234,n:"Veselí nad Moravou",la:48.9505,lo:17.3716,h:43,cat:"town"},
  {id:235,n:"Strážnice",la:48.9032,lo:17.3188,h:176,cat:"town"},
  {id:236,n:"Luhačovice",la:49.1003,lo:17.7564,h:342,cat:"town"},
  {id:237,n:"Valašské Klobouky",la:49.1379,lo:18.0157,h:151,cat:"town"},
  {id:238,n:"Frenštát pod Radhoštěm",la:49.5484,lo:18.2148,h:117,cat:"town"},
  {id:239,n:"Třinec",la:49.6780,lo:18.6725,h:308,cat:"town"},
  {id:240,n:"Kopřivnice",la:49.5980,lo:18.1432,h:229,cat:"town"},
  {id:241,n:"Příbor",la:49.6392,lo:18.1457,h:193,cat:"town"},
  {id:242,n:"Karviná",la:49.8560,lo:18.5430,h:284,cat:"city"},
  {id:243,n:"Havířov",la:49.7793,lo:18.4268,h:167,cat:"city"},
  {id:244,n:"Bohumín",la:49.9062,lo:18.3572,h:95,cat:"town"},
  {id:245,n:"Český Těšín",la:49.7467,lo:18.6240,h:143,cat:"town"},
  {id:246,n:"Jablunkov",la:49.5759,lo:18.7652,h:56,cat:"town"},
  {id:247,n:"Hlučín",la:49.8987,lo:18.1924,h:172,cat:"town"},
  {id:248,n:"Frýdlant nad Ostravicí",la:49.5926,lo:18.3564,h:338,cat:"town"},
  {id:249,n:"Fulnek",la:49.7128,lo:17.9007,h:118,cat:"town"},
  {id:250,n:"Odry",la:49.6617,lo:17.8327,h:205,cat:"town"},
  {id:251,n:"Litovel",la:49.7009,lo:17.0766,h:354,cat:"town"},
  {id:252,n:"Kojetín",la:49.3568,lo:17.3002,h:87,cat:"town"},
  {id:253,n:"Lipník nad Bečvou",la:49.5240,lo:17.5898,h:139,cat:"town"},
  {id:254,n:"Čelákovice",la:50.1579,lo:14.7464,h:312,cat:"town"},
  {id:255,n:"Brandýs nad Labem",la:50.1860,lo:14.6637,h:56,cat:"town"},
  {id:256,n:"Nymburk",la:50.1860,lo:15.0437,h:143,cat:"town"},
  {id:257,n:"Poděbrady",la:50.1434,lo:15.1195,h:27,cat:"town"},
  {id:258,n:"Čáslav",la:49.9118,lo:15.3914,h:105,cat:"town"},
  {id:259,n:"Humpolec",la:49.5416,lo:15.3587,h:174,cat:"town"},
  {id:260,n:"Jindřichův Hradec",la:49.1441,lo:15.0041,h:352,cat:"town"},
  {id:261,n:"Dačice",la:49.0823,lo:15.4360,h:127,cat:"town"},
  {id:262,n:"Moravské Budějovice",la:49.0531,lo:15.8093,h:289,cat:"town"},
  {id:263,n:"Ivančice",la:49.1012,lo:16.3799,h:83,cat:"town"},
  {id:264,n:"Tišnov",la:49.3494,lo:16.4241,h:191,cat:"town"},
  {id:265,n:"Bystřice nad Pernštejnem",la:49.5248,lo:16.2614,h:276,cat:"town"},
  {id:266,n:"Nové Město na Moravě",la:49.5622,lo:16.0749,h:338,cat:"town"},
  {id:267,n:"Hustopeče",la:48.9399,lo:16.7368,h:229,cat:"town"},
  {id:268,n:"Moravský Krumlov",la:49.0518,lo:16.3108,h:307,cat:"town"},
  {id:269,n:"Lanžhot",la:48.7176,lo:17.0316,h:196,cat:"town"},
  {id:270,n:"Říčany",la:49.9921,lo:14.6542,h:56,cat:"town"},
  {id:271,n:"Benešov",la:49.7815,lo:14.6862,h:118,cat:"town"},
  {id:272,n:"Vlašim",la:49.7056,lo:14.8987,h:347,cat:"town"},
  {id:273,n:"Sedlčany",la:49.6607,lo:14.4268,h:82,cat:"town"},
  {id:274,n:"Dobříš",la:49.7803,lo:14.1706,h:163,cat:"town"},
  {id:275,n:"Hořovice",la:49.8352,lo:13.9054,h:319,cat:"town"},
  {id:276,n:"Rokycany",la:49.7441,lo:13.5924,h:47,cat:"town"},
  {id:277,n:"Stříbro",la:49.7503,lo:13.0028,h:231,cat:"town"},
  {id:278,n:"Tachov",la:49.7949,lo:12.6354,h:108,cat:"town"},
  {id:279,n:"Horšovský Týn",la:49.5283,lo:12.9354,h:196,cat:"town"},
  {id:280,n:"Sušice",la:49.2313,lo:13.5194,h:79,cat:"town"},
  {id:281,n:"Strakonice",la:49.2590,lo:13.9043,h:151,cat:"town"},
  {id:282,n:"Blatná",la:49.4249,lo:13.8827,h:26,cat:"town"},
  {id:283,n:"Milevsko",la:49.4541,lo:14.3600,h:312,cat:"town"},
  {id:284,n:"Soběslav",la:49.2562,lo:14.7189,h:87,cat:"town"},
  {id:285,n:"Třeboň",la:49.0041,lo:14.7699,h:106,cat:"town"},
  {id:286,n:"Prachatice",la:49.0111,lo:14.0001,h:267,cat:"town"},
  {id:287,n:"Vimperk",la:49.0555,lo:13.7739,h:142,cat:"town"},
  {id:288,n:"Kaplice",la:48.7383,lo:14.4979,h:43,cat:"town"},
  {id:289,n:"Trhové Sviny",la:48.8404,lo:14.6370,h:52,cat:"town"},
  {id:290,n:"Roudnice nad Labem",la:50.4247,lo:14.2617,h:79,cat:"town"},
  {id:291,n:"Lovosice",la:50.5150,lo:13.9994,h:138,cat:"town"},
  {id:292,n:"Česká Lípa",la:50.6859,lo:14.5350,h:186,cat:"town"},
  {id:293,n:"Nový Bor",la:50.7580,lo:14.5560,h:42,cat:"town"},
  {id:294,n:"Varnsdorf",la:50.9107,lo:14.6138,h:107,cat:"town"},
  {id:295,n:"Rumburk",la:50.9538,lo:14.5571,h:354,cat:"town"},
  {id:296,n:"Jablonec nad Nisou",la:50.7241,lo:15.1704,h:108,cat:"town"},
  {id:297,n:"Tanvald",la:50.7348,lo:15.3044,h:62,cat:"town"},
  {id:298,n:"Semily",la:50.6027,lo:15.3380,h:147,cat:"town"},
  {id:299,n:"Mnichovo Hradiště",la:50.5252,lo:14.9740,h:107,cat:"town"},
  {id:300,n:"Dvůr Králové nad Labem",la:50.4327,lo:15.8138,h:195,cat:"town"},
  {id:301,n:"Jaroměř",la:50.3585,lo:15.9224,h:124,cat:"town"},
  {id:302,n:"Hronov",la:50.4805,lo:16.1836,h:107,cat:"town"},
  {id:303,n:"Nové Město nad Metují",la:50.3437,lo:16.1483,h:14,cat:"town"},
  {id:304,n:"Dobruška",la:50.2919,lo:16.1603,h:218,cat:"town"},
  {id:305,n:"Rychnov nad Kněžnou",la:50.1616,lo:16.2777,h:331,cat:"town"},
  {id:306,n:"Žamberk",la:50.0867,lo:16.4677,h:33,cat:"town"},
  {id:307,n:"Česká Třebová",la:49.9019,lo:16.4487,h:104,cat:"town"},
  {id:308,n:"Vysoké Mýto",la:49.9571,lo:16.1648,h:349,cat:"town"},
  {id:309,n:"Polička",la:49.7147,lo:16.2648,h:221,cat:"town"},
  {id:310,n:"Hlinsko",la:49.7627,lo:15.9073,h:137,cat:"town"},
  {id:311,n:"Chotěboř",la:49.7206,lo:15.6706,h:306,cat:"town"},
  {id:312,n:"Světlá nad Sázavou",la:49.6656,lo:15.4032,h:73,cat:"town"},
  {id:313,n:"Lanškroun",la:49.9114,lo:16.6141,h:298,cat:"town"},
  {id:314,n:"Jeseník",la:50.2271,lo:17.2067,h:197,cat:"town"},
  {id:315,n:"Zlaté Hory",la:50.2584,lo:17.3942,h:325,cat:"town"},
  {id:316,n:"Hanušovice",la:50.0799,lo:16.9357,h:39,cat:"town"},
  {id:317,n:"Žatec",la:50.3289,lo:13.5466,h:247,cat:"town"},
  {id:318,n:"Louny",la:50.3579,lo:13.7998,h:56,cat:"town"},
  {id:319,n:"Kadaň",la:50.3777,lo:13.2726,h:218,cat:"town"},
  {id:320,n:"Ostrov",la:50.3026,lo:12.9378,h:186,cat:"town"},
  {id:321,n:"Jáchymov",la:50.3571,lo:12.9196,h:57,cat:"town"},
  {id:322,n:"Kraslice",la:50.3254,lo:12.5200,h:234,cat:"town"},
  {id:323,n:"Aš",la:50.2241,lo:12.1952,h:109,cat:"town"},
  {id:324,n:"Františkovy Lázně",la:50.1202,lo:12.3526,h:317,cat:"town"},
  {id:325,n:"Bečov nad Teplou",la:50.0843,lo:12.8382,h:43,cat:"town"},
  {id:326,n:"Nepomuk",la:49.4875,lo:13.5786,h:201,cat:"town"},
  {id:327,n:"Přeštice",la:49.5713,lo:13.3374,h:147,cat:"town"},
  {id:328,n:"Horažďovice",la:49.3206,lo:13.6971,h:244,cat:"town"},
  {id:329,n:"Vodňany",la:49.1518,lo:14.1716,h:134,cat:"town"},
  {id:330,n:"Týn nad Vltavou",la:49.2165,lo:14.4186,h:88,cat:"town"},
  {id:331,n:"Hořice",la:50.3634,lo:15.6298,h:38,cat:"town"},
  {id:332,n:"Nová Paka",la:50.4930,lo:15.5165,h:273,cat:"town"},
  {id:333,n:"Vrchlabí",la:50.6260,lo:15.6140,h:318,cat:"town"},
  {id:334,n:"Jilemnice",la:50.6085,lo:15.5052,h:143,cat:"town"},
  {id:335,n:"Harrachov",la:50.7731,lo:15.4241,h:195,cat:"village"},
  {id:336,n:"Broumov",la:50.5846,lo:16.3320,h:183,cat:"town"},
  {id:337,n:"Police nad Metují",la:50.5340,lo:16.2330,h:61,cat:"town"},
  {id:338,n:"Frýdlant v Čechách",la:50.9212,lo:15.0818,h:263,cat:"town"},
  {id:339,n:"Chrastava",la:50.8179,lo:14.9694,h:317,cat:"town"},
  {id:340,n:"Železný Brod",la:50.6436,lo:15.2514,h:281,cat:"town"},
  {id:341,n:"Doksy",la:50.5649,lo:14.6609,h:274,cat:"town"},
  {id:342,n:"Velké Losiny",la:50.0346,lo:17.0470,h:206,cat:"town"},
  {id:343,n:"Lipno nad Vltavou",la:48.6385,lo:14.2165,h:98,cat:"village"},
  {id:344,n:"Hřensko",la:50.8788,lo:14.1702,h:45,cat:"village"},
  {id:345,n:"Holice",la:50.0637,lo:15.9901,h:38,cat:"town"},
  {id:346,n:"Přelouč",la:50.0415,lo:15.5618,h:301,cat:"town"},
  {id:347,n:"Chlumec nad Cidlinou",la:50.1524,lo:15.4616,h:73,cat:"town"},
  {id:348,n:"Nový Bydžov",la:50.2441,lo:15.4928,h:224,cat:"town"},
  {id:349,n:"Kostelec nad Orlicí",la:50.1237,lo:16.2129,h:284,cat:"town"},
  {id:350,n:"Vamberk",la:50.1156,lo:16.2909,h:46,cat:"town"},
  // ── Vesnice a menší místa ──
  {id:351,n:"Slavonice",la:48.9979,lo:15.3481,h:178,cat:"village"},
  {id:352,n:"Holašovice",la:48.9603,lo:14.3031,h:90,cat:"village"},
  {id:353,n:"Boží Dar",la:50.4052,lo:12.9174,h:148,cat:"village"},
  {id:354,n:"Josefov",la:50.3259,lo:15.9200,h:297,cat:"village"},
  {id:355,n:"Loučná nad Desnou",la:50.0666,lo:17.0863,h:67,cat:"village"},
  {id:356,n:"Ostravice",la:49.5579,lo:18.4009,h:51,cat:"village"},
  {id:357,n:"Mosty u Jablunkova",la:49.5198,lo:18.7807,h:227,cat:"village"},
  {id:358,n:"Frymburk",la:48.6631,lo:14.1686,h:223,cat:"village"},
  {id:359,n:"Nové Hrady",la:48.7944,lo:14.7784,h:289,cat:"village"},
  {id:360,n:"Rovensko pod Troskami",la:50.5150,lo:15.2553,h:228,cat:"village"},
  {id:361,n:"Mutěnice",la:48.9010,lo:17.0437,h:107,cat:"village"},
  {id:362,n:"Jaroslavice",la:48.7672,lo:16.2360,h:64,cat:"village"},
  {id:363,n:"Plumlov",la:49.4178,lo:17.0377,h:178,cat:"village"},
  {id:364,n:"Horní Planá",la:48.7652,lo:14.0305,h:57,cat:"village"},
  {id:365,n:"Abertamy",la:50.3757,lo:12.8219,h:321,cat:"village"},
];

// ═══════════════════════════════════════════════════
// GAME ROOMS
// ═══════════════════════════════════════════════════
const rooms = new Map(); // roomCode -> Room

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:5}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function haversine(a,b,c,d) {
  const R=6371, dL=(c-a)*Math.PI/180, dN=(d-b)*Math.PI/180;
  const x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dN/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function calcScore(dist, tol) {
  return Math.max(0, Math.round(5000 * Math.exp(-dist / (tol * 1.8))));
}

function createRoom(settings) {
  const code = genCode();
  const locs = shuffle(LOCS.filter(l => settings.cats.includes(l.cat)))
    .slice(0, Math.min(settings.rounds, 60));

  const room = {
    code,
    settings,
    locs,
    round: 0,
    phase: 'lobby',   // lobby | playing | roundResult | finished
    players: new Map(), // socketId -> { name, score, guesses: [] }
    guesses: new Map(), // socketId -> { lat, lng } for current round
    timerHandle: null,
    createdAt: Date.now()
  };
  rooms.set(code, room);
  return room;
}

function getRoomSafeState(room) {
  const players = [...room.players.values()].map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    ready: p.ready || false,
    guessedThisRound: room.guesses.has(p.id)
  }));
  return {
    code: room.code,
    phase: room.phase,
    round: room.round,
    totalRounds: room.locs.length,
    settings: room.settings,
    players,
    // Only send location AFTER round ends (prevent cheating)
    currentLoc: room.phase === 'roundResult' || room.phase === 'finished'
      ? room.locs[room.round] : null,
    currentLocCat: room.locs[room.round]?.cat,
    waitingFor: room.locs.length > 0
      ? [...room.players.keys()].filter(id => !room.guesses.has(id)).length
      : 0
  };
}

function startRoundTimer(room) {
  if (room.settings.timerSec <= 0) return;
  if (room.timerHandle) clearTimeout(room.timerHandle);
  room.timerHandle = setTimeout(() => {
    // Auto-submit missing guesses (center of CZ)
    room.players.forEach((_, sid) => {
      if (!room.guesses.has(sid)) {
        room.guesses.set(sid, { lat: 49.75, lng: 15.6, autoSubmit: true });
      }
    });
    resolveRound(room);
  }, room.settings.timerSec * 1000);
}

function resolveRound(room) {
  if (room.timerHandle) { clearTimeout(room.timerHandle); room.timerHandle = null; }
  const loc = room.locs[room.round];
  const results = [];

  room.players.forEach((player, sid) => {
    const guess = room.guesses.get(sid) || { lat: 49.75, lng: 15.6, autoSubmit: true };
    const dist = haversine(guess.lat, guess.lng, loc.la, loc.lo);
    const score = calcScore(dist, room.settings.tol);
    player.score += score;
    player.guesses.push({ round: room.round, dist, score, lat: guess.lat, lng: guess.lng });
    results.push({ id: sid, name: player.name, dist, score, totalScore: player.score, lat: guess.lat, lng: guess.lng, autoSubmit: guess.autoSubmit || false });
  });

  // Sort by score desc
  results.sort((a, b) => b.score - a.score);
  room.phase = 'roundResult';
  room.guesses.clear();

  io.to(room.code).emit('roundResult', {
    loc,
    results,
    round: room.round,
    totalRounds: room.locs.length,
    isLast: room.round >= room.locs.length - 1
  });

  // Auto-advance after 10s (multiplayer only — solo waits for player click)
  if (!room.settings.solo) {
    room.autoAdvance = setTimeout(() => {
      if (room.phase === 'roundResult') advanceRound(room);
    }, 10000);
  }
}

function advanceRound(room) {
  if (room.autoAdvance) { clearTimeout(room.autoAdvance); room.autoAdvance = null; }
  if (room.round >= room.locs.length - 1) {
    finishGame(room);
    return;
  }
  room.round++;
  room.phase = 'playing';
  room.guesses.clear();
  const loc = room.locs[room.round];
  io.to(room.code).emit('newRound', {
    round: room.round,
    totalRounds: room.locs.length,
    locCat: loc.cat,
    locHeading: loc.h,
    locLat: loc.la,
    locLng: loc.lo,
    timerSec: room.settings.timerSec
  });
  startRoundTimer(room);
}

function finishGame(room) {
  room.phase = 'finished';
  const finalScores = [...room.players.values()]
    .map(p => ({ id: p.id, name: p.name, score: p.score, guesses: p.guesses }))
    .sort((a, b) => b.score - a.score);
  io.to(room.code).emit('gameFinished', { finalScores, locs: room.locs });
}

// ═══════════════════════════════════════════════════
// SOCKET.IO EVENTS
// ═══════════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log(`[+] ${socket.id} connected`);

  // Create room
  socket.on('createRoom', ({ name, settings }) => {
    const room = createRoom(settings);
    socket.join(room.code);
    const player = { id: socket.id, name, score: 0, guesses: [], ready: false };
    room.players.set(socket.id, player);
    socket.data.roomCode = room.code;
    socket.data.name = name;

    if (settings.solo) {
      // Solo mode: auto-start immediately, skip waiting room
      room.phase = 'playing';
      player.ready = true;
      const loc = room.locs[0];
      socket.emit('soloStart', {
        round: 0,
        totalRounds: room.locs.length,
        locCat: loc.cat,
        locHeading: loc.h,
        locLat: loc.la,
        locLng: loc.lo,
        timerSec: room.settings.timerSec
      });
      startRoundTimer(room);
      console.log(`[SOLO] ${room.code} started by ${name}`);
    } else {
      socket.emit('roomCreated', { code: room.code, state: getRoomSafeState(room) });
      console.log(`[ROOM] ${room.code} created by ${name}`);
    }
  });

  // Join room
  socket.on('joinRoom', ({ code, name }) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) { socket.emit('error', { msg: 'Místnost nenalezena.' }); return; }
    if (room.phase !== 'lobby') { socket.emit('error', { msg: 'Hra již probíhá.' }); return; }
    if (room.players.size >= 8) { socket.emit('error', { msg: 'Místnost je plná (max 8).' }); return; }

    socket.join(room.code);
    const player = { id: socket.id, name, score: 0, guesses: [], ready: false };
    room.players.set(socket.id, player);
    socket.data.roomCode = room.code;
    socket.data.name = name;
    socket.emit('roomJoined', { code: room.code, state: getRoomSafeState(room) });
    socket.to(room.code).emit('playerJoined', { name, state: getRoomSafeState(room) });
    console.log(`[JOIN] ${name} joined ${room.code}`);
  });

  // Player ready (start game vote)
  socket.on('setReady', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'lobby') return;
    const player = room.players.get(socket.id);
    if (!player) return;
    player.ready = true;
    io.to(room.code).emit('playerReady', { name: player.name, state: getRoomSafeState(room) });

    // Start if all ready and at least 1 player
    const allReady = [...room.players.values()].every(p => p.ready);
    if (allReady && room.players.size >= 1) {
      room.phase = 'playing';
      const loc = room.locs[0];
      io.to(room.code).emit('gameStarted', {
        round: 0,
        totalRounds: room.locs.length,
        locCat: loc.cat,
        locHeading: loc.h,
        locLat: loc.la,
        locLng: loc.lo,
        timerSec: room.settings.timerSec
      });
      startRoundTimer(room);
    }
  });

  // Submit guess
  socket.on('submitGuess', ({ lat, lng }) => {
    const room = rooms.get(socket.data.roomCode);
    console.log(`[GUESS] ${socket.id} submitted guess, room=${socket.data.roomCode}, phase=${room?.phase}, guesses=${room?.guesses.size}/${room?.players.size}`);
    if (!room || room.phase !== 'playing') return;
    if (room.guesses.has(socket.id)) return; // already guessed

    room.guesses.set(socket.id, { lat, lng });
    const player = room.players.get(socket.id);
    // Notify others that this player guessed (not the coords)
    io.to(room.code).emit('playerGuessed', {
      name: player?.name,
      waitingFor: [...room.players.keys()].filter(id => !room.guesses.has(id)).length
    });

    // All players guessed → resolve immediately
    console.log(`[GUESS] After set: guesses=${room.guesses.size}/${room.players.size}`);
    if (room.guesses.size >= room.players.size) {
      console.log(`[RESOLVE] All guessed, resolving round ${room.round}`);
      resolveRound(room);
    }
  });

  // Next round (after seeing result)
  socket.on('nextRound', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'roundResult') return;
    const player = room.players.get(socket.id);
    if (player) player.readyNext = true;

    // Solo: advance immediately
    if (room.settings.solo) {
      room.players.forEach(p => p.readyNext = false);
      advanceRound(room);
      return;
    }

    const allNext = [...room.players.values()].every(p => p.readyNext);
    if (allNext) {
      room.players.forEach(p => p.readyNext = false);
      advanceRound(room);
    }
  });

  // Chat message
  socket.on('chat', ({ msg }) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    const name = socket.data.name || '?';
    io.to(room.code).emit('chat', { name, msg: msg.substring(0, 120) });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    const player = room.players.get(socket.id);
    room.players.delete(socket.id);
    if (player) {
      io.to(room.code).emit('playerLeft', { name: player.name, state: getRoomSafeState(room) });
    }
    if (room.players.size === 0) {
      if (room.timerHandle) clearTimeout(room.timerHandle);
      if (room.autoAdvance) clearTimeout(room.autoAdvance);
      rooms.delete(room.code);
      console.log(`[ROOM] ${room.code} deleted (empty)`);
    }
    console.log(`[-] ${socket.id} (${player?.name}) disconnected`);
  });
});

// Cleanup old rooms every hour
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, code) => {
    if (now - room.createdAt > 3600000) {
      rooms.delete(code);
    }
  });
}, 3600000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ČeskýGeo server running on port ${PORT}`);
});
