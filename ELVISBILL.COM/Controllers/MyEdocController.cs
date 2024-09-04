using ELVISBILL.COMMON.YJIT_Utils;
using ELVISBILL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;


namespace ELVISBILL.COM.Controllers
{
    public class MyEdocController : Controller
    {
        // GET: /Edoc/
        // 전역 변수 및 객체 생성
        //static private List<EdocListModel> EdocList;
        Encryption ec = new Encryption(); //DB_Data - Encryption 삼영 조회 CRM 카운팅 조회 
        string strJson = "";
        string strResult = "";
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        ELVISBILL.COMMON.Controllers.ELVISBILL EB = new ELVISBILL.COMMON.Controllers.ELVISBILL();        

        /// <summary>
        /// TempData 쓰는 데이터 함수
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            if (TempData.ContainsKey("ContentType"))
            {
                string ref1 = TempData["ContentType"].ToString();
                if (ref1 != "")
                {
                    ViewBag.ContentType = ref1;
                }
            }
            if (TempData.ContainsKey("SearchType"))
            {
                string ref1 = TempData["SearchType"].ToString();
                if (ref1 != "")
                {
                    ViewBag.SearchType = ref1;
                }
            }
            if (TempData.ContainsKey("CRN_NO"))
            {
                string ref1 = TempData["CRN_NO"].ToString();
                if (ref1 != "")
                {
                    ViewBag.CRN_NO = ref1;
                }
            }
            if (TempData.ContainsKey("N_Value"))
            {
                string ref1 = TempData["N_Value"].ToString();
                if (ref1 != "")
                {
                    ViewBag.N_Value = ref1;
                }
            }
            if (TempData.ContainsKey("Email"))
            {
                string ref1 = TempData["Email"].ToString();
                if (ref1 != "")
                {
                    ViewBag.Email = ref1;
                }
            }

            return View();
        }

        public class EdocParams
        {
            public string ContentType { get; set; } // 공급자(S)  /   default : 공급받는자(B)

            public string SearchType { get; set; } // 번호기준(N) / 담당자(S) / 이메일(E)

            public string CRN_NO { get; set; } // 사업자번호

            public string N_Value { get; set; } // 번호기준 : B/L No or Invoice No or 계산서 번호

            public string Email { get; set; } // 담당자 : Email

            public string DOMAIN { get; set; } // 담당자 : Email
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public string EdocView(EdocParams value)
        {
            // 공급자(S)  /   default : 공급받는자(B)
            try
            {
                string strResult = "";

                if (value.ContentType == "B")
                {
                    if (value.SearchType == "N")
                    {
                        //번호 기준으로 들어왔을 때 (사업자 번호 / B/L No or Invoice No or 계산서 번호)
                        TempData["ContentType"] = value.ContentType;
                        TempData["SearchType"] = value.SearchType;
                        TempData["CRN_NO"] = value.CRN_NO;
                        TempData["N_Value"] = value.N_Value;
                    }
                    else if (value.SearchType == "S")
                    {
                        //담당자 정보로 들어왔을 때 (사업자 번호 / 이메일 주소)
                        TempData["ContentType"] = value.ContentType;
                        TempData["SearchType"] = value.SearchType;
                        TempData["CRN_NO"] = value.CRN_NO;
                        TempData["Email"] = value.Email;
                    }
                    else if (value.SearchType == "E")
                    {
                        TempData["ContentType"] = value.ContentType;
                        TempData["SearchType"] = value.SearchType;
                        TempData["CRN_NO"] = value.CRN_NO;
                        TempData["N_Value"] = value.N_Value;
                    }
                }
                else if (value.ContentType == "S")
                {
                    //공급자 화면 (추후 나중에 개발)
                }
                else if (value.ContentType == "A")
                {
                    //Admin 화면

                    //번호 기준으로 들어왔을 때 (사업자 번호 / B/L No or Invoice No or 계산서 번호)
                    TempData["ContentType"] = value.ContentType;
                    TempData["SearchType"] = value.SearchType;
                    TempData["CRN_NO"] = value.CRN_NO;
                    TempData["N_Value"] = value.N_Value;
                }

                strResult = "Y";

                return strResult;

            }
            catch (Exception e)
            {
                strResult = e.Message;
                return strResult;
            }
        }

        public string InitSession()
        {
            Session.Clear();
            Session.RemoveAll();
            Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();

            return "Y";
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        /// <summary>
        /// 번호기준 리스트 , 담당자 리스트 데이터 가져오기
        /// </summary>
        /// <returns></returns>
        public ActionResult fnMySearchList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnGetMySearchList(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                //ds = JsonConvert.DeserializeObject<DataSet>(strJson);
                //dt = ds.Tables["Result"];

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 레이어팝업 세금계산서 데이터 가져오는 로직
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnGetTaxSearchData(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnGetTaxSearchData(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 레이어팝업 세금계산서 데이터 가져오는 로직
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnGetCreditSearchData(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnGetCreditSearchData(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnSetTaxApproval(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnSetApproval(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnSetAllTaxApproval(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnSetAllApproval(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 레이어팝업 세금계산서 데이터 가져오는 로직
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnSetTaxRefuse(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnSetRefuse(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 승인 , 거절 후 데이터 그리기
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnPageRefresh(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnGetSearchList_ReFresh(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 세금계산서 데이터 가져오기.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnExampleTaxPrint(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnExampleTaxPrint(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 세금계산서 데이터 가져오기.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnTaxPrint(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnTaxPrint(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnCreateSlip(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnCreateSlip(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnKeep_CreateSlip(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnKeep_CreateSlip(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 세금계산서 로그 - PRINT
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public void fnTaxPrint_PRINT(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                EB.fnTaxPrint_PRINT(vEncodeData);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);    
            }
        }

        /// <summary>
        /// 세금계산서 로그 - END 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public void fnTaxPrint_END(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                EB.fnTaxPrint_END(vEncodeData);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
