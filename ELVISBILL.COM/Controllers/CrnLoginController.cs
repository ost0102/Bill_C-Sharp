using System;
using ELVISBILL.COMMON.Controllers;
using ELVISBILL.COMMON.YJIT_Utils;
using ELVISBILL.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Net;
using System.Net.Sockets;

namespace ELVISBILL.COM.Controllers
{
    public class CrnLoginController : Controller
    {
        //
        // GET: /CrnLogin/
        //static private List<EdocListModel> EdocList;
        Encryption ec = new Encryption(); //DB_Data - Encryption 
        string strJson = "";
        string strResult = "";        
        DataTable dt = new DataTable();
        ELVISBILL.COMMON.Controllers.ELVISBILL EB = new ELVISBILL.COMMON.Controllers.ELVISBILL();

        public ActionResult Index()
        {
            return View();
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        /// <summary>
        /// 사업자 번호 및 접수번호로 있는것 체크
        /// </summary>
        /// <returns></returns>
        public ActionResult fnCheckCrn(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnCheckCrn(vEncodeData);

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

        //[HttpGet]
        ///// <summary>
        ///// Insert Log Data
        ///// </summary>
        ///// <returns></returns>
        //public ActionResult fnSetLog()
        //{
        //    try
        //    {
        //        Console.WriteLine(fnGetIP());

        //        return Content("<script>alert('"+fnGetIP()+"')</script>");
        //    }
        //    catch(Exception e)
        //    {

        //        return Content(e.Message);
        //    }

        //}


        //public string fnGetIP()
        //{
        //    IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
        //    string ipAddr = string.Empty;
        //    for (int i = 0; i < host.AddressList.Length; i++)
        //    {

        //        ipAddr += host.AddressList[i].ToString() + "\r\n";

        //        //if (host.AddressList[i].AddressFamily == AddressFamily.InterNetwork)
        //        //{
        //        //    ipAddr = host.AddressList[i].ToString();
        //        //}
        //    }

        //    return ipAddr;
        //}

    }
}
