<template>
  <div style="width:600px">
    <el-table :data="list" border size="medium">
      <el-table-column
        prop="respDeptName"
        label="分级管理单位"
        width="180px" 
      />
      <el-table-column
        prop="allCount"
        label="项目数"
      />

      <el-table-column
        prop="allAmt"
        label="总投资(亿元)"
        width="120px" 
      />
    
      <el-table-column
        prop="allPlanAmt"
        label="年计划投资(亿元)"
        width="140px" 
      />
    </el-table>
  </div>
</template>
<script>
const columns = [
  { label: "分级管理单位", prop: "respDeptName", width: 180, fixed: "left", showOverflowTooltip: true },
  { label: "项目数", prop: "allCount", align: "right", type: "number" },
  { label: "总投资(亿元)", prop: "allAmt", width: 120, align: "right", type: "number" },
  { label: "年计划投资(亿元)", prop: "allPlanAmt", width: 140, align: "right", type: "number" },
  // {
  //   label: "在建项目",
  //   children: [
  //     { label: "项目数", prop: "zjCount", width: 120, align: "right", type: "number" },
  //     { label: "总投资(亿元)", prop: "zjAmt", width: 120, align: "right", type: "number" },
  //     { label: "年计划投资(亿元)", prop: "zjPlanAmt", width: 140, align: "right", type: "number" },
  //     { label: "年实际投资(亿元)", prop: "zjYearRealAmt", width: 140, align: "right", type: "number" },
  //     { label: "完成投资比例", prop: "zjAmtRate", width: 120, align: "center" },
  //   ],
  // },
];
export default {
  data() {
    return {
      columns,
      list: [
        {
    "respDeptCode": null,
    "respDeptName": "全部",
    "allCount": 1590,
    "allAmt": 41266.08,
    "allPlanAmt": 6169.09,
    "zjCount": 1357,
    "zjAmt": 33444.9,
    "zjPlanAmt": 5694.86,
    "zjYearRealAmt": 2766.52,
    "zjAmtRate": "48.58%",
    "ybCount": 233,
    "ybAmt": 7821.18,
    "ybPlanAmt": 474.23,
    "czglCount": 0,
    "czglAmt": 0,
    "czglPlanAmt": 0,
    "startCount": 505,
    "startMonthCountRange": 217,
    "zjStartMonthCountRange": 191,
    "ybStartMonthCountRange": 26,
    "startYearCount": 217,
    "startRate": "42.97%",
    "endCount": 278,
    "endMonthCountRange": 39,
    "endYearCount": 39,
    "endRate": "14.03%",
   
},
{
    "respDeptCode": "00520001",
    "respDeptName": "福州市发展和改革委员会",
    "allCount": 241,
    "allAmt": 7329.92,
    "allPlanAmt": 1077.03,
    "zjCount": 202,
    "zjAmt": 6191.69,
    "zjPlanAmt": 961.68,
    "zjYearRealAmt": 493.36,
    "zjAmtRate": "51.30%",
    "ybCount": 39,
    "ybAmt": 1138.22,
    "ybPlanAmt": 115.35,
    "czglCount": 0,
    "czglAmt": 0,
    "czglPlanAmt": 0,
    "startCount": 66,
    "startMonthCountRange": 35,
    "zjStartMonthCountRange": 22,
    "ybStartMonthCountRange": 13,
    "startYearCount": 35,
    "startRate": "53.03%",
    "endCount": 43,
    "endMonthCountRange": 10,
    "endYearCount": 10,
    "endRate": "23.26%",
        },
      ]
    }
  },
  
}
</script>