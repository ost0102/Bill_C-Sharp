using ELVISBILL.COMMON.Controllers;
using ELVISBILL.COMMON.YJIT_Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ELVISBILL.Models;
using Newtonsoft.Json;
using System.Data;

namespace ELVISBILL.COM.Controllers
{
	public class HomeController : Controller
	{        

        public ActionResult Index()
		{
            //fnGetNoticeListData();

            //return View(NoticeList);

            return View();
		}

        public ActionResult About()
        {
            //fnGetNoticeListData();

            //return View(NoticeList);

            return View();
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        //[HttpPost]
        //public ActionResult fnGetTestData(JsonData value)
        //{
        //    string strJson = "";
        //    string strResult = "";

        //    Encryption ec = new Encryption(); //DB_Data - Encryption 
        //    ConnectTest exp = new ConnectTest();

        //    try
        //    {
        //        string vJsonData = value.vJsonData.ToString();
        //        string vEncodeData = "";

        //        //암호화 걸기
        //        vEncodeData = ec.encryptAES256(vJsonData);

        //        //2~3. 데이터 보내기 및 데이터 받기
        //        strResult = exp.GetDomainData(vEncodeData);

        //        //4.데이터 받은거 복호화
        //        strJson = ec.decryptAES256(strResult);

        //        //5 데이터 Json으로 보내기
        //        return Json(strJson);
        //    }
        //    catch (Exception e)
        //    {
        //        strJson = e.Message;

        //        return Json(strJson);
        //    }
        //}

        [HttpPost]
        public ActionResult fnGetNoticeList(JsonData value)
        {
            string strJson = "";
            string strResult = "";
            Encryption ec = new Encryption(); //DB_Data - Encryption 
            CRM Crm = new CRM();
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = Crm.fnGetNoticeList(vEncodeData);

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

        [HttpPost]
        public ActionResult fnGetNoticeListData(JsonData value)
        {
            string strJson = "";
            string strResult = "";
            Encryption ec = new Encryption(); //DB_Data - Encryption 
            CRM Crm = new CRM();
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = Crm.fnGetNoticeListData(vEncodeData);

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

        [HttpPost]
        public ActionResult USR_Login(JsonData value)
        {
            string strJson = "";
            string strResult = "";
            Encryption ec = new Encryption(); //DB_Data - Encryption 
            ELVISBILL.COMMON.Controllers.ELVISBILL EB = new ELVISBILL.COMMON.Controllers.ELVISBILL();
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnCheckLogin(vEncodeData);

                strJson = ec.decryptAES256(strResult);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }



        public ActionResult saveUsrLgoin(JsonData value)
        {
            DataSet ds = JsonConvert.DeserializeObject<DataSet>(value.vJsonData);
            DataTable rst = ds.Tables["Result"];
            DataTable dt = ds.Tables["Table"];

            try
            {
                if (rst.Rows[0]["trxCode"].ToString() == "N")
                {
                    return Content("N");
                }
                if (rst.Rows[0]["trxCode"].ToString() == "Y")
                {
                    Session["USER_ID"] = dt.Rows[0]["USER_ID"].ToString(); // 사용자 ID 
                    Session["BUSN_NM"] = dt.Rows[0]["BUSN_NM"].ToString(); //상호명
                    Session["BUSN_NO"] = dt.Rows[0]["BUSN_NO"].ToString(); //사업자 등록번호
                    //Session["PSWD"] = dt.Rows[0]["PSWD"].ToString();
                    //Session["WHCD"] = dt.Rows[0]["WHCD"].ToString();
                    //Session["OFFICE_CD"] = dt.Rows[0]["OFFICE_CD"].ToString();
                    Session["DOMAIN"] = System.Configuration.ConfigurationManager.AppSettings["HomeUrl"];
                    Session["DOMAIN_NM"] = System.Configuration.ConfigurationManager.AppSettings["Domain"];

                    


                    return Content("Y");
                }


                return Content("N");
            }
            catch (Exception e)
            {
                return Content(e.Message);
            }

        }

        [HttpPost]
        public ActionResult UpdatePW(JsonData value)
        {
            string strJson = "";
            string strResult = "";
            Encryption ec = new Encryption(); //DB_Data - Encryption 
            ELVISBILL.COMMON.Controllers.ELVISBILL EB = new ELVISBILL.COMMON.Controllers.ELVISBILL();
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnUpdateMyPW(vEncodeData);

                strJson = ec.decryptAES256(strResult);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public string LogOut()
        {
            Session.Clear();
            Session.RemoveAll();
            Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();

            return "Y";
        }

    }
}
