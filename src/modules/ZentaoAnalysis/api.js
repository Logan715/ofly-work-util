import RequestUtil from '@/utils/RequestUtil'

export const analysisPlan = ({userName, password, planId}) => {
  return RequestUtil.post("/oflywork/zentao/analysis/plan", {userName, password, planId});
}

export const getFinishedTaskList = ({userName, password, url}) => {
  return RequestUtil.post("/oflywork/zentao/task/finish", {userName, password, url});
}

export const getAnalysisDateList = (planId) => {
  return RequestUtil.get("/oflywork/zentao/analysis/plan/analysisDateList", {params: {planId}});
}

export const getAnalysisPlanResult = (planId, date) => {
  return RequestUtil.post("/oflywork/zentao/analysis/plan/result", {planId, date});
}





