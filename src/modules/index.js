export default {
    ZentaoAnalysis: () => import(/* webpackChunkName: "ZentaoAnalysis" */ "@/modules/ZentaoAnalysis/index.vue"),
    Base64: () => import(/* webpackChunkName: "Base64" */ "@/modules/Base64/index.vue"),
    Convert: () => import(/* webpackChunkName: "Convert" */ "@/modules/Convert/index.vue"),
    OCR: () => import(/* webpackChunkName: "Ocr" */ "@/modules/Ocr/index.vue"),
}; 
