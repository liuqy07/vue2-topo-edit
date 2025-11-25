export default {
  nodes: [
    {
      id: "132154_015230016028",
      label: "SD-JN-SHMJ-A.LEAF-2.MCN.CX600-X8A-1",
      ip: "150.139.0.212",
      layer: "IPRAN_B",
      img: "163.png",
      radio: 1,
      imgSouce:'',
      type: "img-node",
      style: {
        width: 45,
        height: 38,
        cursor: "move",
      },
 
    },
    {
      id: "132154_015230016027",
      start: true,
      label: "SD-JN-SHMJ-A.LEAF-1.MCN.CX600-X8A-2",
      ip: "150.139.0.211",
      layer: "IPRAN_B",
      img: "ipran_b_1.png",
      radio: 1,
      type: "img-node",
      style: {
        radius: 0,
        width: 45,
        height: 38,
        cursor: "move",
      },

    },
    {
      id: "132154_150139000011",
      label: "SD-JN-SLLH-M-1.STN.CX600-X16A-3",
      ip: "150.139.0.9",
      layer: "MAN_ER",
      img: "er_5.png",
      radio: 1,
      type: "img-node",
      style: {
        radius: 0,
        width: 45,
        height: 38,
        cursor: "move",
      },
   
    },
    {
      id: "132154_015230016023",
      label: "SD-JN-SLLH-LEAF-2.MCN.CX600-X8A-4",
      ip: "150.139.0.199",
      layer: "IPRAN_B",
      img: "ipran_b_1.png",
      radio: 1,
      type: "img-node",
      style: {
        radius: 0,
        width: 45,
        height: 38,
        cursor: "move",
      },
  
    },
    {
      id: "132154_015230016024",
      label: "SD-JN-SNL-LEAF-2.MCN.CX600-X8A-5",
      end: true,
      ip: "150.139.0.200",
      layer: "IPRAN_B",
      img: "ipran_b_1.png",
      radio: 1,
      type: "img-node",
      style: {
        radius: 0,
        width: 45,
        height: 38,
        cursor: "move",
      },
    },
  ],
  edges: [
    {
      source: "132154_015230016027",
      target: "132154_150139000011",

      label: "1111",
      labelCfg: {
        autoRotate: true,
        refY: 10,
      },
      dire: "positive",
      mainBak: "main",
      style: {
        lineDash: undefined,
        stroke: "#409eff",
      },
      // type: 'custom-edge'
    },
    {
      source: "132154_150139000011",
      target: "132154_015230016023",

      labelCfg: {
        autoRotate: true,
        refY: 10,
      },
      label: "2222",
      dire: "positive",
      mainBak: "main",
      style: {
        lineDash: undefined,
        stroke: "#409eff",
      },
      // type: 'custom-edge'
    },
    {
      source: "132154_015230016023",
      target: "132154_015230016024",
      labelCfg: {
        autoRotate: true,
        refY: 10,
      },
      label: "3333",
      dire: "positive",
      mainBak: "main",
      style: {
        lineDash: undefined,
        stroke: "#409eff",
      },
      // type: 'custom-edge'
    },
    // 111111111
  ],
};
