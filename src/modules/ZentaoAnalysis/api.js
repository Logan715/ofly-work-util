import RequestUtil from '@/utils/RequestUtil'
import lodash from 'lodash'

export const reloadProductionList = ({userName, password}) => {
  return RequestUtil.post("/oflywork/zentao/production/reloadAllProduction", {userName, password});
}

export const getProductionList = () => {
  return RequestUtil.get("/oflywork/zentao/production/getList");
}

export const getFocusProductionList = () => {
  return RequestUtil.get("/oflywork/zentao/production/getFocusList");
}

export const toggleFocusProduction = (id) => {
  return RequestUtil.post("/oflywork/zentao/production/toggleFocus", {id});
}

export const reloadAllPlanByProductionId = ({userName, password, productionId}) => {
  return RequestUtil.post("/oflywork/zentao/plan/reloadAllPlanByProductionId", {userName, password, productionId});
}

export const getPlanList = (productionId) => {
  return RequestUtil.post("/oflywork/zentao/plan/getList", {productionId});
}
export const getFocusPlanList = (productionId) => {
  return RequestUtil.get("/oflywork/zentao/plan/getFocusList", {productionId});
}

export const toggleFocusPlan = (id) => {
  return RequestUtil.post("/oflywork/zentao/plan/toggleFocus", {id});
}

export const getFocusPlanTree = () => {
  return RequestUtil.post("/oflywork/zentao/plan/getFocusPlanTree");
}



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





