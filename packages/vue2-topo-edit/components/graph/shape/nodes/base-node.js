/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础节点, 其他节点都在此基础上继承和扩展
 */

import itemEvents from './item-event'
import anchorEvent from './anchor-event'
import defaultStyles from '../defaultStyles'

// import imglist from '@/ifitTopo/template/static/static/static.js'

const { iconStyles, nodeStyles, anchorPointStyles, nodeLabelStyles } = defaultStyles

function getStyle(options, cfg) {
  return {
    ...cfg,
    // 自定义默认样式
    ...nodeStyles,
    ...options,
    // 当前节点样式
    ...cfg.style,
    // 文本配置
    labelCfg: {
      ...nodeLabelStyles,
      ...cfg.labelCfg
    },
    // 图标样式
    iconStyles: {
      ...iconStyles,
      ...cfg.iconStyles
    },
    // 锚点样式
    anchorPointStyles: {
      ...anchorPointStyles,
      ...cfg.anchorPointStyles
    },
    ...cfg.nodeStateStyles,
    // 锚点高亮样式
    anchorHotsoptStyles: cfg.anchorHotsoptStyles
  }
}

/*
 * 注册基础node => 添加锚点/图标 => 绘制node => 初始化node状态 => node动画(设置交互动画)
 */
export default (G6, vue) => {
  const imglist = [
    {
        "id": "c0f53f9851d04d36876e23a5e4b70f30",
        "revision": 0,
        "imgsrc": "computer.png",
        "width": 40,
        "height": 35,
        "level": "COMPUTER",
        "remark": "COMPUTER",
        "value": "/inoe-ui/static/img/computer.88a47f2c.png"
    },
    {
        "id": "9c55d207693442e3a65684b75b96cc13",
        "revision": 2,
        "imgsrc": "sw_5.png",
        "width": 40,
        "height": 35,
        "level": "CYW-SW",
        "remark": "SW",
        "value": "/inoe-ui/static/img/sw_5.69a62a27.png"
    },
    {
        "id": "829650791b064b0cbbad950bd3b02623",
        "revision": 3,
        "imgsrc": "mse_9.png",
        "width": 40,
        "height": 35,
        "level": "CYW-MSE",
        "remark": "MSE",
        "value": "/inoe-ui/static/img/mse_9.ecb2d02f.png"
    },
    {
        "id": "67fb704832744b3e928c69df2f869121",
        "revision": 7,
        "imgsrc": "olt_1.png",
        "width": 40,
        "height": 35,
        "level": "OLT",
        "remark": "OLT",
        "value": "/inoe-ui/static/img/olt_1.e7e9685d.png"
    },
    {
        "id": "bb3bad766b5b49cd9569f922ecc00aba",
        "revision": 3,
        "imgsrc": "p_1.png",
        "width": 40,
        "height": 35,
        "level": "pUP",
        "remark": "P",
        "value": "/inoe-ui/static/img/p_1.30f1137e.png"
    },
    {
        "id": "f92ff04967054b6889f63baff5966322",
        "revision": 1,
        "imgsrc": "spine_1.png",
        "width": 40,
        "height": 35,
        "level": "SPINE",
        "remark": "SPINE",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "f8d70da46fb94711a9af607e3fb03e38",
        "revision": 1,
        "imgsrc": "firewall.png",
        "width": 40,
        "height": 35,
        "level": "FIREWALL",
        "remark": "FIREWALL",
        "value": "/inoe-ui/static/img/firewall.a04a7367.png"
    },
    {
        "id": "4dbb419743b14ec293db903e56597944",
        "revision": 2,
        "imgsrc": "asbr_5.png",
        "width": 40,
        "height": 35,
        "level": "CYW-ASBR",
        "remark": "ASBR",
        "value": "/inoe-ui/static/img/asbr_5.050a3a81.png"
    },
    {
        "id": "ec2ed6b765c1467e8bfb97974afee1db",
        "revision": 0,
        "imgsrc": "board_leaf_6.png",
        "width": 40,
        "height": 35,
        "level": "BORDERLEAF",
        "remark": "BORDERLEAF",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "977c4f7c91bf48229656b48e5052df19",
        "revision": 1,
        "imgsrc": "cr_4.png",
        "width": 40,
        "height": 35,
        "level": "CYW-CR",
        "remark": "CR",
        "value": "/inoe-ui/static/img/cr_4.7567684d.png"
    },
    {
        "id": "d4a60c2d8e7a46659d668e92f38cd461",
        "revision": 0,
        "imgsrc": "ipran_a_6.png",
        "width": 40,
        "height": 35,
        "level": "IPRAN_A",
        "remark": "IPRANA",
        "value": "/inoe-ui/static/img/ipran_a_6.d195819e.png"
    },
    {
        "id": "949459cc7f4f49119a20cad58de64e39",
        "revision": 1,
        "imgsrc": "ipran_u_9.png",
        "width": 40,
        "height": 35,
        "level": "IPRAN-U",
        "remark": "IPRANU",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "ec0deda727c54fffa72cb25aa2cc3d6a",
        "revision": 1,
        "imgsrc": "er_5.png",
        "width": 40,
        "height": 35,
        "level": "AL_ER",
        "remark": "ER",
        "value": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABECAMAAABEZbBtAAACi1BMVEUAAADI//u6//ra///H//y9//vP//+8//vH//zF//vH//3M///I//y8//vI//zI//vI//zG//vG//zH//7I//3M//+8/vrI//zE//zI//y+//q+//vI//u///vI//zH//3D//zJ//zK//3J///K///P//+///u9//vA//vI//zF//zJ///M///J///I//zH//y9//u///vH//u///rB//rI//zI//zI//zJ//zJ//zS//+I7un///8A0cgA08oA1cwA1s0A1MsA187H//wA0skA0MYA2M+4/vkAz8UA2dAA29IA2tEA3NQAzsSF7OgA2tK8/vr9//9w5+Fu5uBs5d5n4923/vln5N0j4dmv/PeH7ul36uSo+fRy6OJp5d6y/fhk49y0/viK7uqD7ehx5d9r494I2tH1/f2c9fB97Oal+PSj9/Ju6+Z66uVs5uAb3tbt/Pur+vWq+vTI9fKh9/Gf9vGM7+oJ3NPn+/rN9/WB7Od16eOx+/as+/aV8+6S8eyO8Ot18Ot76+aO6uZp6eM84tsA3dX3/v6a9O+t8Ox25uAI1s3f+vjc+fi78/Cz8e6p7+td6uN55+DV+PaY8++38u+P8e2c7eiC7OeL6uWB6eNb5uBB49s04to539ch3tcP3tYg3NMS1Mvp+/rZ+fel+/XQ9/XN9vSN9e+A8uyG6eRx6OJ95+JH5Nzy/fzv/Py//vrj+vmc+PK/8/GR9vCH9e6I8eyi8OyN7+uF7umg7elz7ueS6+dn7eaA7OZx6uVN5+A75d5O491J3dUG0cjE9vSV9/Ke7emW7OiC7OhT6OFg4tst4dpX4Nkx3NQj2dDD/vug+PPK9vOd9fGZ9fBN3tYq3dUT2tOe7ejQxtAUAAAAO3RSTlMA1P4H9PAM+duFdh779ebQrI2BTkcX/fee4N3Ww762l3BcQDUTEOrpxb1gOSwp8O7hzMq3paJU8l9VIlN2tKoAAAn4SURBVFjDzZn1W1NRGMdxotjd3d0dG7DdwdkYomsHY4FDBhOQVilBLLAVFRFE7O7u7s4/x/fE7r2DTWf84OvzCDz3vPdzvm+d3buQ/8jad+82Y0z/KaNadQzrJZEgiUQSFtax1eh+/Qf2adej59/fv2WPrgP7dZQgaian3WLJyrZa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"
    },
    {
        "id": "922fb095e053414d8dc67815d1b9246b",
        "revision": 1,
        "imgsrc": "sr_3.png",
        "width": 40,
        "height": 35,
        "level": "CYW-SR",
        "remark": "SR",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "b133009349494d039131e0255c6d5e6f",
        "revision": 5,
        "imgsrc": "dsw_3.png",
        "width": 40,
        "height": 35,
        "level": "CYW-SW",
        "remark": "DSW",
        "value": "/inoe-ui/static/img/dsw_3.70543687.png"
    },
    {
        "id": "d6a093b781d44f39a5c6486e33b6b834",
        "revision": 1,
        "imgsrc": "bras_5.png",
        "width": 40,
        "height": 35,
        "level": "CYW-BAS",
        "remark": "BRAS",
        "value": "/inoe-ui/static/img/bras_5.6baaa473.png"
    },
    {
        "id": "f20265aac0f44059a90f6a34d6e865cb",
        "revision": 0,
        "imgsrc": "ce_6.png",
        "width": 40,
        "height": 35,
        "level": "IPRAN_CE",
        "remark": "CE",
        "value": "/inoe-ui/static/img/ce_6.c88af364.png"
    },
    {
        "id": "e8ecd6a1219743baa9224b60efc7f012",
        "revision": 0,
        "imgsrc": "sr_2.png",
        "width": 40,
        "height": 35,
        "level": "CYW-SR",
        "remark": "SR",
        "value": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABECAMAAABEZbBtAAACylBMVEUAAADqt5PqupbpuJTntI/ruZXsupf6waHlsInkrof/7t//7d//7t//7t/rupb/7t/rupbrupbtvJj/8OXvvZr/7t/quZX/7t//7uD///Lrupb/7t//7t/rupb/7t/supbsupf/7uD/7uH/7+D/7+HsupfvvJr//+rirIT/7t/ruZX+69r/7t7rupb/7t/ruZbru5brupbsu5btu5f/7+X/7d/ruJXquZTqupb/79//7t//7d/qupb/8OD/7+Dsu5b/7+D/7uPmtpLyz7T85tP+7dzruZXruZX538r96dfruJTruZX86dfzzrH/79/quZfsu5bruZb/797/7+D/797/8eP/8+jmv5////+8bja9cDn/7d6+cTq9bzi+czvBeUO7bTXCe0bFgU3Ad0C/dD2/dT7quZXBeELEf0rDfUjGg07DfEfAdkDEfknCekW/dj/XrInNon/FgEzDfknpxKbepn3lvp3nwqPsyq7IhVP96dnrx6rftpXar4z69vLw4tf33cny1r7x1LztzbHOpIHOlGjkz73Vq4j75dTv0LfkvJzju5vUqofSqIX859b549D02MLhuZjYrYrTqYbPpoTRm3L+/v7+/Pr59O/06uL+69v44c7uz7Tmv57bsY7Ln3v65NLctJLLoX7Ym2/NkWP7+PX27+j34Mzo1cXl0cDiy7npxqjbvqbmwaHYuZ7XtpvetJLcs5DTlGbNiln17eft2Mj12sXw07rryazZu6HQpoTIiFf8+vf48Ovx5tzw5Nn65NPv3dD44c3m0sHpz7zgyLTexK7cwKneuJvUsZPdroran3TVmGu/jmXMjV/s3dDr2s3p18nhv6XWtJfVspXRq4zQqYjfqH7WoHjHmnXRmW7q08DTr5HWqITZpX7dpHrTnnTPjV7Mh1X38ezz6N/ny7blybLlxq/kxKzFl3HQkGHUqIXZp4HAkGg92I6KAAAAV3RSTlMA/aDe/f1WDP798eTVzcO5tKcoHBnr0pt+B8rFr6yRkXlqW0g9PB8L/vn08tu8pJmMgWlJEPTy7OOMiHNiUk1BOS376und29rZ1dXUxrhubm1mXjEvJBb1FfR5AAAJ30lEQVRYw6yVy2sTURSHR901CVmIJNJS0BZEFFcKPlAUFRTUha8bclr3utAM1EnNO52QSWLeCWo0b7DGmEcDYm3QWiptyaK2pQ8puNONiP+Dk5kYp8lkchW/VcidmY9z7j2/S2Cxc/Cqul91qE/Zqzgo6+mRHVT0KvsOqY6p956+SfwHbpw80a+U7wcJjsj7+q+c2vmvhsOnjit7gMcQsNkn3XGafmt8NaLXj7wyjtJxt3ssaEsbgGeXUj2w7y8VuweOK/jvvwhO0kY9kkBvjI8FZznb/l71ILZj38lDXBUBOz2CsBmJB9NcVaqB3RiS06ojAOCy00XUicwPnZDKn8LooL9u6j/TpVl75PUyxl4hKUybJefLOk6ORY9w0WifAQDFXolNV+8C8Ns5hySULuvU/CZWbV02Bg0AB/d06N0eVhKIIwyocDbf1Dh1qI2i2wUgE6toUA7wbBRHkjCThSeaJmsmJAadBui93ropxwBcNMIh4yi/bhheT2s0j7MUEsfth/0ntoaJAsCOJTFVv0w3JE8KZLQ0/sGHOlEMAigPE03OyMBlxLKkNpYakudzZJhi+zcVlnh81ADyZgxd64FZPV4ti494yeOXDsbDn4aE5NCmQdbw7JSBDWFC8ntviUYeIiz0z0DOR50CZhEuTI7TlHQIF/0M9HHjAn49wmWixo9kVLSlTMSno9r69hQG2KDsARphkyAtnGcj1LYU8q2vTFvnyGTrwiScJ4i9EOj67Ychk2kiU6kkkx5mRXz0H3odOe54jC+2efwwSFwCt5SCfb+ajdZqq+XSVGFh3ZdZ5TTvyXoHTaHE75Aj8481HI/W2vbNDiriAEhdKh7GkY9pmnyIJLLPuV9fJpDp++pGioxGmLCZnLc0nrBuphJt0wMXCQAkQqgRkeQc+1WhBkWWuV85L8qU6lP6+sOyc+FrY/1bzWESGR44IK4xLzLsXAgictrKsRxBlTI/OSTFaYSMlxwVhMQ1frGm6V7mSbMgIsu+iLeOL4So7Dvuv3IlEx0XlmpZIM0dIgfOETZwi2g+sm81I3Lr+xE+1ZYilDdKpjbWCvkVa+xrzEnqOkW1HS4QZ+GZqEYjjEjhWnJKw9K4ABIhUzLMeKtRn7dz+vjhMnHUAKMSGicXkUKoLH90C2aEhxv824kdRnAVO2s2q23z7rPyp66KGWpsHazmcxBsnTWPcmTrvZUs8CsOrJAuBoDexmru30nDm1ZNeSmXn59aXXekSEeqdWS/812bD+NoXoDtLqfRfjKArbg1YRwMozNXTCEPEonIGn+kY6kEznWTfjDEa7SfZiAgETntEclh2aRQF4wusD0Y4jXDw9oHb+DpJIbEw0bku8amrfxkUBfsT2Hs9pC2Uc2wdvgeBRB4i7ogjMh1NhGkoV0AE7e02iEtX03d86v5cnltIorC+ESTtN2UVqQLQXSjiCC+QF0IggsFXag7M8kkZpLcmcnMZCBTMeOj1kBRKz5Qa1tbfJBoBTeS2KrUgpUqpS0iIljqW3wh/hGee+712viIXbjwg3aTSX75vvPNuRNlqi8cbq36eHPh4p0hDul+Ciuyum73hMMDRTkSEW5kWQkpoeQYPPn25ao81XRzyNAdPCKrOjkZDt97BVZkoHwPDRUKmftPwIv55j8kdpZP/iGsuKpqPgSfc2lMowwZKMINUkCJsZ4wWDq657ePgi8e37x68AGsyKqMW/QjWr+m4EMpRGAoBWJD7ZLb9p2Hy3ry+37j5/DZs2eOH6s2kEMQVnjvnqIcAgZKhKYAhw6Hg0KZyRwl7e3L58DVTLUnl7+Pb9v3RpNDcoibAYooNEhQ6N8uq6O9NUx1ZOBQ7+3mv4wid/RQK0wDNHBsKgHzCIUoB0UzExi0wzkgylLUyXa4vVDnj/SdysPv9Rz9uU7XIf5kz/UezQ/cP8Kv2Zs/Nqkmk9FIBAeg4G3COiCL2aAbhkESXAbfI5p49OpGc/5SuKpO5ptvvHoUSyRSqWSUYoSbigrQEEPTMNwNXBKNRpPJVMoxHr0Za2++3XvrVGsP/fZ7j/S0nsr35q63j00W1Xg8nolpiYTzA0M/TzRNFk2bnhnHwCVISVpOIqHFYplM3DRN27B1FZROp+F/VtcNw4jHYzHEWCkWmjzdjHCDu+YXO/R14IAZxsnE4FsbQNGzOnKQYruGaWYygNGQAu+gO6UiNZxNfR02QFAYBGcTZRjHAgoI3FAMcJAC0nXXNkzAUzeWZSEGDAACYhNF08gKaQHRZPSiCDPCDYaWAjPAATPAcV1XZ2YApIPADIaWqJgNC13hoZVJUFpESsKNwABUYKwUd0Mzc22XucHQsjQ0AxrA3AgMg4g1sHtpjSRt8SflXyjIEbNhbqADgx1Tnp7Nqp436Hl0NkAx4QV0k8LZIAWkCDMqWS5J0mpSwPtGiGUGYn12kAJVi8c/dbZ03n2iq214fF79pLq2bWBovNBRNhsGUdhskkuWzpVAjeTt9JXGzSg8NHADGI1iDrS0Gfrpcy8B87JYbDsNRHDDbhsMjblBO4pYNuNklURV0+R7J+zsEn3md2fSoU3DQo+MGK5r9z/Jtu3soLN5PqyDGQgN3TiOg5gIbwDfnBNklsQ0d3OgXLlshBvsM7jBpn3ueqPbtAEUo6bV4Q+6zTmaCK1y2UQKpAEZyGkiBVlAeNPEfSNm4x3c2dI/Okhn83F09Mnw1SILjc8Gm8ZCw00D0p6RRs7A3BrJErtiOJgazsZy2GigAmbx8vOWTjqbg/39w13dRdt2TRMLjZQfbmRMrewPLJQqtGopmUgySqjivoHQLB5ahwezSfe/z2Jo6mDXZ93GQsdYBRCDFOSYr8nsDdJPWtxA/F8imBli+EpDOxzTNWrA1x8dYph0dnjkR581fg5EuRnFKvgCC2qkX7W6ifhLFiBE0/hocHPCbD4OTRl6W/eIytyo/dd0F0IzkVNZaLPgIw1zpN8r2ER841l+3IimOZYWQzfZkXNXWjqfezy07Icuz0U3mQxzw0OT3z0jpGGR9Gctmh8gtSVz+qlmWdg02gBjsKNjMMtWGuVgn1lqomhRr+AnaxaAk6qau7CJkLqJdFQcnglHNA1WJyxoxqHnACt0jB2eTiqplcf9JLBsfY00A81ZuZUQ3+6SZ+ERjQ0ADp43OoibwdVp0wWNhY6XC0sICdRvnyvNWIt3zF8L76kbL72zeWjs8LRtGhqsAAABhYWWfjvxupYQsml5sNLHjEytXz4vQMBX3etC6UvZU12KwTMa7aS98tvSxPgzCiBr6lcEq9uozgqubJwHxlA+n99fW1tXV+v3b/QRrnX1sxauXiz9C9XM2RDctnLBrMb5Dcvq582rX9Ywv3HWioWrgosWS/+TvgFh7OwSfKCzcgAAAABJRU5ErkJggg=="
    },
    {
        "id": "4afed3eed56a47ceb59f4ef37798af05",
        "revision": 0,
        "imgsrc": "rr_4.png",
        "width": 40,
        "height": 35,
        "level": "RR",
        "remark": "RR",
        "value": "/inoe-ui/static/img/rr_4.17d44c76.png"
    },
    {
        "id": "793ad6f9216a47a79694ca7ba568507a",
        "revision": 0,
        "imgsrc": "pe_9.png",
        "width": 40,
        "height": 35,
        "level": "PE",
        "remark": "PE",
        "value": "/inoe-ui/static/img/pe_9.f50b684b.png"
    },
    {
        "id": "cddd2ce742e345498ca69d66b2569fb3",
        "revision": 3,
        "imgsrc": "dcgw_2.png",
        "width": 40,
        "height": 30,
        "level": "DCGW",
        "remark": "DCGW",
        "value": "/inoe-ui/static/img/dcgw_2.a9de2ad7.png"
    },
    {
        "id": "c237c167a98e43d5bb1a16d256d81ab1",
        "revision": 2,
        "imgsrc": "er_5.png",
        "width": 40,
        "height": 35,
        "level": "MAN_ER",
        "remark": "ER",
        "value": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABECAMAAABEZbBtAAACi1BMVEUAAADI//u6//ra///H//y9//vP//+8//vH//zF//vH//3M///I//y8//vI//zI//vI//zG//vG//zH//7I//3M//+8/vrI//zE//zI//y+//q+//vI//u///vI//zH//3D//zJ//zK//3J///K///P//+///u9//vA//vI//zF//zJ///M///J///I//zH//y9//u///vH//u///rB//rI//zI//zI//zJ//zJ//zS//+I7un///8A0cgA08oA1cwA1s0A1MsA187H//wA0skA0MYA2M+4/vkAz8UA2dAA29IA2tEA3NQAzsSF7OgA2tK8/vr9//9w5+Fu5uBs5d5n4923/vln5N0j4dmv/PeH7ul36uSo+fRy6OJp5d6y/fhk49y0/viK7uqD7ehx5d9r494I2tH1/f2c9fB97Oal+PSj9/Ju6+Z66uVs5uAb3tbt/Pur+vWq+vTI9fKh9/Gf9vGM7+oJ3NPn+/rN9/WB7Od16eOx+/as+/aV8+6S8eyO8Ot18Ot76+aO6uZp6eM84tsA3dX3/v6a9O+t8Ox25uAI1s3f+vjc+fi78/Cz8e6p7+td6uN55+DV+PaY8++38u+P8e2c7eiC7OeL6uWB6eNb5uBB49s04to539ch3tcP3tYg3NMS1Mvp+/rZ+fel+/XQ9/XN9vSN9e+A8uyG6eRx6OJ95+JH5Nzy/fzv/Py//vrj+vmc+PK/8/GR9vCH9e6I8eyi8OyN7+uF7umg7elz7ueS6+dn7eaA7OZx6uVN5+A75d5O491J3dUG0cjE9vSV9/Ke7emW7OiC7OhT6OFg4tst4dpX4Nkx3NQj2dDD/vug+PPK9vOd9fGZ9fBN3tYq3dUT2tOe7ejQxtAUAAAAO3RSTlMA1P4H9PAM+duFdh779ebQrI2BTkcX/fee4N3Ww762l3BcQDUTEOrpxb1gOSwp8O7hzMq3paJU8l9VIlN2tKoAAAn4SURBVFjDzZn1W1NRGMdxotjd3d0dG7DdwdkYomsHY4FDBhOQVilBLLAVFRFE7O7u7s4/x/fE7r2DTWf84OvzCDz3vPdzvm+d3buQ/8jad+82Y0z/KaNadQzrJZEgiUQSFtax1eh+/Qf2adej59/fv2WPrgP7dZQgaian3WLJyrZa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"
    },
    {
        "id": "efaddf7923fd472cb06804708d6fdfb8",
        "revision": 2,
        "imgsrc": "dc_leaf_6.png",
        "width": 40,
        "height": 35,
        "level": "DCLEAF",
        "remark": "DCLEAF",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "b65979edd76a47fa8382fcc5e58b0a10",
        "revision": 2,
        "imgsrc": "s_leaf_2.png",
        "width": 40,
        "height": 30,
        "level": "SLEAF",
        "remark": "SLEAF",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "c417d484e6e049c8bbf6ce24dbd73ec2",
        "revision": 1,
        "imgsrc": "basestation.png",
        "width": 35,
        "height": 60,
        "level": "BASESTATION",
        "remark": "BASESTATION",
        "value": "/inoe-ui/static/img/basestation.7b6de6a4.png"
    },
    {
        "id": "a4e4dc0a78d44a2d8007f0ef0a44b823",
        "revision": 0,
        "imgsrc": "server.png",
        "width": 40,
        "height": 35,
        "level": "SERVER",
        "remark": "SERVER",
        "value": "data:image/png;base64,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"
    },
    {
        "id": "963c0d8648c146f0b084530db8aa408b",
        "revision": 1,
        "imgsrc": "ipran_b_1.png",
        "width": 40,
        "height": 35,
        "level": "IPRAN_B",
        "remark": "IPRANB",
        "value": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABECAMAAABEZbBtAAAC91BMVEUAAAD/wob/wof+wYb/7d3/7d3+vH3/7d3/w4j/w4j/8eX9uHj/wIP/7d7/wof/9ef/2KL/7t//7t//xIj/7+H/xYv/yI7/wof/w4f/7d3/7t//7t//7uD/7+D/w4j/7+D///L8tXX/7t7/7t//xIj/xIj/w4j/w4n/7uD/7+H/x4r7sm//7t//w4j/w4j/7t//w4f/7uD/w4n/8OD/wob/w4r/wof/woj/7d//xYn/xYj/xIn/wob/1az/4sX/06j/8N7/xYf/xIn4vYz/////7d7/wofkaAXlaQTmawPjZwXfZgfdYgHcYQHteyDpdxrobwDeZALjagDtrXn0iC/vfyTpcRXxgijnbQHvgSfseh7yhSvygynjZgjiZQflbADzhy7ufSL4vYvzhi3kaAr//PrmbA/obgHmbgDfZQD2uYb5rGXsdxvrdRnjbQ/bYADhaAD95M/ur3vnbxL3vIr1t4Tsr33srnvwgCblagzgaAnnbALgZgD+9u/83cPqcxflbxH3uojxsXz++vf5xpv4wpXiaw3zs3/xsn71iTH+6dj94Mf7zKbvsH3srHfxrHbodRjodBfmchblcBPqeBzhaQviZQbhaQH87+T65tX82bz6z6rxxJ/ts4PsfifqeR3ndx398+v94sr71LP70rH5yaH4wJLnfSz+9/L5xJjwvJPtnFzwlUzsjUXvijXufiP++fT88uj77eD/6NT95tH5yJ7tsIDxj0D7693948372Lr50K7yyajwwZr4vo72uYfutYf33sr2yqf6yqPyxqP4v4/uuIz0toPzmk7ohzn+69r66Nn44c711rz71rbz0bPztYHzsn3rqnXrqHHxomL0nlPzl0jxkkXrhzrmcRT449H007j0uo312MDppGzmnWH2pF3zn1nrhDHnbQP228X3xJz1r3b3rG7siz3yjjrrgSHncgvzzK3tqnTzpmjoomjrl1Tpkk3tiTH0wpnyuIjztoHvr3von2TrgCvpdw7peybleSP4tX/5ZZ26AAAAQ3RSTlMA/aDe/u/95sCoHP791NMODM25kDwoGfTJxZuQfmtmWwf93a+DeVdSSS4f/vS2sKSZiWxR6OHbtHNHPjru6tm4RkJB0CRvVwAAC6dJREFUWMOslktoGlEU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"
    },
    {
        "id": "eeb7de44c426487699a155c64395856b",
        "revision": 1,
        "imgsrc": "a_leaf_8.png",
        "width": 40,
        "height": 35,
        "level": "ALEAF",
        "remark": "ALEAF",
        "value": "/inoe-ui/static/img/a_leaf_8.6b59d18b.png"
    },
    {
        "id": "6dd6eae7946e4f3ab19045b215cb5659",
        "revision": 6,
        "imgsrc": "ce_7.png",
        "width": 40,
        "height": 35,
        "level": "IPRAN_CE",
        "remark": "CE",
        "value": "/inoe-ui/static/img/ce_7.419bcf7c.png"
    }
]
  G6.registerNode(
    'base-node',
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80
        const height = cfg.style.height || 40

        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 20,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2
          },
          cfg
        )
      },
      // 绘制图标
      drawIcon(cfg, group, attrs) {
        const { logoIcon, stateIcon } = attrs
        const icons = [logoIcon, stateIcon]

        icons.forEach(($item, index) => {
          if ($item) {
            const className = `${attrs.type}-${index === 0 ? 'logoIcon' : 'stateIcon'}`

            let item = group.$getItem(className)

            if (!item) {
              const icon = group.addShape($item.img ? 'image' : 'text', {
                attrs: {
                  ...$item,
                  ...$item.style
                },
                draggable: true,
                className
              })

              icon.toFront()
              item = group.$getItem(className)
            }

            if (item) {
              if ($item.show) {
                item.show()
              } else {
                item.hide()
              }
            }
          }
        })
      },
      // 绘制锚点
      initAnchor(cfg, group) {
        group.anchorShapes = []
        group.showAnchor = () => {
          this.drawAnchor(cfg, group)
        }
        group.clearAnchor = () => {
          if (group.anchorShapes) {
            const line = group.$getItem('dashed-line')

            if (line) {
              line.remove()
            }
            group.anchorShapes.forEach((a) => a.remove())
          }
          group.anchorShapes = []
        }
      },
      drawAnchor(cfg, group, attrs) {
        setTimeout(() => {
          // },200)
          const { type, direction, anchorPointStyles } = group.getFirst().attr()
          const item = group.get('children')[0]
          const bBox = item.getBBox()
          // bBox.x = -bBox.width/2
          // bBox.y = -bBox.height/2
          const anchors = this.getAnchorPoints(cfg)
          // 绘制锚点坐标
          anchors &&
            anchors.forEach((p, i) => {
              const diff = type === 'triangle-node' ? (direction === 'up' ? 1 : 0) : 0.5
              const x = bBox.width * (p[0] - 0.5)
              const y = bBox.height * (p[1] - diff)

              /**
               * 绘制三层锚点
               * 最底层: 锚点bg
               * 中间层: 锚点
               * 最顶层: 锚点group, 用于事件触发
               */
              // 视觉锚点
              const anchor = group.addShape('circle', {
                attrs: {
                  x: x,
                  y: y,
                  ...anchorPointStyles
                },
                zIndex: 1,
                nodeId: group.get('id'),
                className: 'node-anchor',
                draggable: true,
                isAnchor: true,
                index: i
              })

              // 锚点事件触发的元素
              const anchorGroup = group.addShape('circle', {
                attrs: {
                  x,
                  y,
                  r: 11,
                  fill: '#000',
                  opacity: 0
                },
                zIndex: 2,
                nodeId: group.get('id'),
                className: 'node-anchor-group',
                draggable: true,
                isAnchor: true,
                index: i
              })
              /**
               * 添加锚点事件绑定
               */
              anchorEvent(anchorGroup, group, p)

              group.anchorShapes.push(anchor)
              group.anchorShapes.push(anchorGroup)
            })

          // 查找所有锚点
          group.getAllAnchors = () => {
            return group.anchorShapes.filter((c) => c.get('isAnchor') === true)
          }
          // 查找指定锚点
          group.getAnchor = (i) => {
            return group.anchorShapes.filter((c) => c.get('className') === 'node-anchor' && c.get('index') === i)
          }
          // 查找所有锚点背景
          group.getAllAnchorBg = () => {
            return group.anchorShapes.filter((c) => c.get('className') === 'node-anchor-bg')
          }
        }, 200)
      },
      // 添加链路状态显示的数字
      drawsscont(cfg, group, attrs) {
        const width = cfg.style.width || 80
        const height = cfg.style.height || 40
        const [urgent, serious] = cfg.counts ? cfg.counts : [] // serious严重问题数，urgent紧急问题数
        const textNode = ' | '
        const child = group.getChildren().filter((item) => {
          return item.cfg.name == 'statusGroup'
        })
        const group1 = child && child[0] ? child[0] : []
        if (group1.getChildren().length > 0) {
          // 移除节点重新绘制
          group1.getChildren().forEach((item) => {
            item.remove()
          })
        }
       
        group1.addShape('text', {
          attrs: {
            text: serious || '0',
            x: width / 2 + 10,
            y: -height / 2 + 5,
            fill: '#f27859',
            fontSize: 10,
            textAlign: 'center'
            // stroke: "red",
          },
          className: 'node-alarm',
          draggable: true
        })

        group1.addShape('text', {
          attrs: {
            text: textNode,
            x: width / 2 + 19,
            y: -height / 2 + 4,
            fill: '#f27859',
            fontSize: 10,
            textAlign: 'top'
          },
          className: 'node-alarm',
          draggable: true
        })

        group1.addShape('text', {
          attrs: {
            text: urgent || '0',
            x: width / 2 + 32,
            y: -height / 2 + 5,
            fill: '#ffb74b',
            fontSize: 10,
            textAlign: 'center'
            // stroke: "yellow",
          },
          className: 'node-alarm',
          draggable: true
        })
      },

      /* 添加文本节点 */
      /* https://g6.antv.vision/zh/docs/manual/advanced/keyconcept/shape-and-properties/#%E6%96%87%E6%9C%AC-text */
      addLabel(cfg, group, attrs) {
        const { label, labelCfg, labels, height } = attrs

        // 字体小于12时 svg会报错
        /* if (labelCfg && labelCfg.fontSize < 12) {
        labelCfg.fontSize = 12;
      } */
        // 多行文本
        if (labels) {
          labels.forEach((item) => {
            const {
              label,
              labelCfg: { maxlength },
              className
            } = item

            let text = maxlength ? label.substr(0, maxlength) : label || ''

            if (label.length > maxlength) {
              text = `${text}...`
            }

            group.addShape('text', {
              attrs: {
                text,
                ...item,
                ...item.labelCfg,
                ...item.labelCfg.style
              },
              className: `node-text ${className}`,
              draggable: true
            })
          })
        } else {
          const { maxlength } = labelCfg

          let text = maxlength ? label.substr(0, maxlength) : label || ' '

          if (label.length > maxlength) {
            text = `${text}...`
          }

          const type = group.get('item').get('model').type
          let position_y = 0
          if (type == 'img-node') {
            position_y = height / 2 + 12
          } else if (type == 'img-cloud') {
            position_y = 0
          }
          group.addShape('text', {
            attrs: {
              text,
              x: 0,
              y: position_y, // 单行文本的偏移量
              ...labelCfg,
              ...labelCfg.style
            },
            className: 'node-text',
            draggable: true
          })
        }
      },

      /* 绘制节点，包含文本 */
      draw(cfg, group) {
        return this.drawShape(cfg, group)
      },
      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        // let  width = cfg.style.width || 80;
        // let  height = cfg.style.height || 40;
        const attrs = this.getShapeStyle(cfg, group)
        // 添加节点
        const shape = group.addShape(this.shapeType, {
          // shape 属性在定义时返回
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
          attrs
        })
        // 存在图片节点时候，吧图片作为节点渲染
        if (cfg.img) {
          const { width, height } = attrs
           let imgurl
           let url
           const level = cfg?.level ?? cfg.name
          if (cfg.type == 'img-cloud') {
            //  url = require('@/assets/images/topo/vector.png')
          } else {
            cfg.radio == 1 ? imgurl = cfg.img : imgurl = imglist.find((_item) => _item.level.replace(/[_-]/g, '') == level.replace(/[_-]/g, ''))?.imgsrc ?? 'p_1.png'
             const path =  imgurl.replace('.png', '.svg')
             url = require(`@/assets/images/svg/${path}`)
            //  new URL(`../../../../assets/images/svg/${path}`, import.meta.url).href
          }
          group.addShape('image', {
            attrs: {
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              img: url,
              opacity: 1, // this.shapeType == 'rect'? 1 : 1,
              clipCfg: {
                show: false,
                type: 'circle',
                r: 50
              }
            },
            draggable: true
          })
          group.toBack()
        }
        // 添加分组，留给上方的数字显示使用
        const group1 = group.addGroup({
          name: 'statusGroup',
          capture: false,
          draggable: false,
          visible: true
        })

        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group.get('children').find((item) => item.get('className') === className)
        }

        // 添加文本节点
        this.addLabel(cfg, group, attrs)
        // 添加图标
        this.drawIcon(cfg, group, attrs)
        // 添加锚点
        this.initAnchor(cfg, group)

        if (cfg.counts) {
          this.drawsscont(cfg, group, attrs)
        }
        group.toFront()
        return shape
      },
      /* 更新节点，包含文本 */
      update(cfg, node) {
        const model = node.get('model')
        const { attrs } = node.get('keyShape')
        const group = node.get('group')
        const circel_r = cfg.width >= cfg.height ? cfg.width : cfg.height
        attrs.r = (circel_r / 2 + 5) || 20 // 修改图片大小时候，显示外部的圆圈大小
        const text = group.$getItem('node-text')
        const item = group.get('children')[0]
        const item1 = group.get('children')[1]
        // const item2 = group.get('children')[2].get('children')
        const { width, height } = cfg.style
        // 更新文本内容
        const type = group.get('item').get('model').type
        const labelCfgstyle = model.labelCfg?.style || {}

        let position_y = 0
        if (type == 'img-node') {
          position_y = height / 2 + 12
        } else if (type == 'img-cloud') {
          position_y = 0
        }
        console.log('position_y===>', position_y)
        if (model.updateLabel) {
          position_y = position_y + 2
          labelCfgstyle.lineHeight = 15
          labelCfgstyle.textAlign = 'center'
          labelCfgstyle.textBaseline = 'top'
        }
        text &&
          text.attr({
            y: position_y, // 单行文本的偏移量
            text: model.label,

            ...labelCfgstyle
          })
        // 更新节点属性
        if (attrs.type === 'diamond-node') {
          const path = this.getPath({
            style: {
              size: model.size
            }
          })
          item.attr({
            ...attrs,
            ...model.style,
            path,
            width: model.size[0],
            height: model.size[1]
          })
        } else {
          const logoIcon = group.get('children').find((x) => x.cfg.className === `${attrs.type}-logoIcon`)

          if (logoIcon) {
            logoIcon.attr({ ...model.logoIcon })
          }

          const stateIcon = group.get('children').find((x) => x.cfg.className === `${attrs.type}-stateIcon`)
          if (stateIcon) {
            stateIcon.attr({ ...model.stateIcon })
          }
          item.attr({
            ...attrs,
            ...model.style,
            x: this.shapeType == 'circle' ? -0 : -width / 2,
            y: this.shapeType == 'circle' ? -0 : -height / 2
          })
          if (type == 'img-node' || type == 'img-cloud') {
          let imgurl
           let url
          if (type == 'img-cloud') {
             url = new URL ('@/assets/images/topo/vector.png', import.meta.url).href
          } else {
            const level = cfg?.level ?? cfg.name
             cfg.radio == 1 ? imgurl = cfg.img : imgurl = imglist.find((_item) => _item.level == level)?.imgsrc ?? 'p_1.png'
             const path =  imgurl.replace('.png', '.svg')
              url = require(`@/assets/images/svg/${path}`)
            //  url = new URL(`../../../../assets/images/svg/${path}`, import.meta.url).href
          }
            item1.attr({
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              img: url
            })
          }
        }
        group.toFront()

        if (cfg.counts && cfg.counts.length > 0) {
          this.drawsscont(cfg, group, attrs)
        } else if (!cfg.counts || (cfg.counts && cfg.counts.length == 0)) {
          const statusGroup = group.find((ele) => ele.get('name') == 'statusGroup')
          statusGroup && statusGroup.clear()
        }
      },
      afterUpdate(cfg, node) {
        // let { width, height } = cfg.style;
        const group = node.get('group')
        group.cfg.children[2].cfg.visible = true
        const keyShape = node.get('keyShape')
        if (cfg.counts) {
          keyShape.attr('r', 36)
        }
        group.toFront()
      },

      /* 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现 */
      setState(name, value, item) {
        const buildInEvents = [
          'anchorShow',
          'anchorActived',
          'nodeState',
          'nodeState:default',
          'nodeState:selected_node',
          'nodeState:selected',
          'nodeState:hover',
          'nodeOnDragStart',
          'nodeOnDrag',
          'nodeOnDragEnd',
          'selected',
          'alarm-urgent',
          'alarm-general',
          'alarm-serious'
        ]
        const group = item.getContainer()
        if (group.get('destroyed')) return

        if (buildInEvents.includes(name)) {
          if (name.indexOf('alarm') > -1) {
            itemEvents['alarm-urgent'].call(this, value, group, name)
          } else {
            // 当元素存在告警的时候，点击选中其他不增加状态
            const hasalarm = item.getStates().some((ele) => {
              return ele.indexOf('alarm') > -1
            })

            if (!hasalarm) {
              itemEvents[name].call(this, value, group, name)
            }
          }
          // 内部this绑定到了当前item实例
        } else if (this.stateApplying) {
          // eslint-disable-next-line no-useless-call
          this.stateApplying.call(this, name, value, item)
        } else {
          console.warn(`warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`)
        }
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        let arr = []
        if (vue.isEdit) {
          arr = [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5]
          ]
        } else {
          ;[
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
            [0.5, 0.5]
          ]
        }

        return cfg.anchorPoints || arr
      }
    },
    'single-node'
  )
}
