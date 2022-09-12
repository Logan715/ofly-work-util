import RequestUtil from '@/utils/RequestUtil'
import lodash from 'lodash'

export const analysisPlan = ({userName, password, planId}) => {
  return RequestUtil.post("/oflywork/zentao/analysis/plan", {userName, password, planId});
}

export const getFinishedTaskList = ({userName, password, url}) => {
  return RequestUtil.post("/oflywork/zentao/task/finish", {userName, password, url});
}

export const getAnalysisDateList = (planId) => {
  return RequestUtil.get("/oflywork/zentao/analysis/plan/analysisDateList", {params: {planId}});
}

export const getAnalysisPlanResult = (planId, dates) => {
  
  const _dates = lodash.sortBy(Array.from(new Set(dates))).reverse()
  return RequestUtil.post("/oflywork/zentao/analysis/plan/result", {planId, dates: _dates});
}

export const getCompareList = ({
  planId,
  type,
  state,
  dates,
}) => {
  const _dates = lodash.sortBy(Array.from(new Set(dates)))
  return RequestUtil.post("/oflywork/zentao/analysis/plan/getCompareList", {planId, type, state, dates: _dates});
}





