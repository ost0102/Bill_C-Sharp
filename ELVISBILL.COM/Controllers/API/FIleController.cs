using ELVISBILL.COMMON.YJIT_Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using System.Security.Principal;
using System.Configuration;

namespace ELVISBILL.COM.Controllers.API
{
    public class FIleController : Controller
    {
        //
        // GET: /FIle/        
        Common Comm = new Common();

        public class EdocParams
        {
            public string FILE_NM { get; set; } //업로드 시 실제 파일 이름

            public string FILE_PATH { get; set; } // 파일 경로

            public string REPLACE_FILE_NM { get; set; } // 실제 파일경로에 있는 파일 이름 
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        /// <summary>
        /// XML 파일 DOWNLOAD
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult FileDownload(EdocParams value)
        {
            string strFILE_NM = value.FILE_NM;
            string strFILE_PATH = value.FILE_PATH;
            try
            {
                //System.IO.FileInfo fi = new System.IO.FileInfo(Server.MapPath("~/Content/Upload/") + strFILE_PATH + "\\" + strREPLACE_FILE_NM);
                System.IO.FileInfo fi = new System.IO.FileInfo(strFILE_PATH);

                if (fi.Exists)
                {
                    //return File(fi.FullName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", strFILE_NM);
                    return File(fi.FullName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", strFILE_NM);
                }
                else
                {
                    return Content("<script>alert('파일이 존재하지 않습니다.'); window.history.back();</script>");
                }
            }
            catch (Exception ex)
            {
                return Content("<script>alert('" + ex.Message + "')</script>");
            }
        }

        /// <summary>
        /// XML DOWNLOAD
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnFileDownload(JsonData value)
        {
            try
            {
                // 새 사용자 임시 로그온 하기
                //IntPtr token = WndLogin.LogonUser("evbAdmin", "yjit1231!", ".", LogonType.LOGON32_LOGON_NETWORK_CLEARTEXT, LogonProvider.LOGON32_PROVIDER_DEFAULT);
                IntPtr token = WndLogin.LogonUser("evbWeb", "yjiT1q2w!@", ".", LogonType.LOGON32_LOGON_NETWORK_CLEARTEXT, LogonProvider.LOGON32_PROVIDER_DEFAULT);
                WindowsIdentity identity = new WindowsIdentity(token);
                WindowsImpersonationContext ctx = identity.Impersonate();

                //fnDeleteFile();
                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(value.vJsonData);

                string strReplaceFileNM = dt.Rows[0]["REPLACE_FILE_NM"].ToString(); //reaplce 파일명
                string strFileNM = dt.Rows[0]["FILE_NM"].ToString();//실제 파일명
                string strNowFilePath = @"" + System.Configuration.ConfigurationManager.AppSettings["FilePath"].ToString() + dt.Rows[0]["FILE_PATH"].ToString(); //파일 경로
                //string strNowFilePath = @"\\110.45.209.81\nas2" + dt.Rows[0]["FILE_PATH"].ToString(); //파일 경로

                string strMovePath = Server.MapPath("~/Files/Download/") + "";

                DirectoryInfo dic = new DirectoryInfo(strMovePath);
                if (dic.Exists == false)
                {
                    dic.Create();
                }

                // 파일 복사
                System.IO.File.Copy(strNowFilePath+"/"+ strFileNM, strMovePath + strReplaceFileNM, true);

                dt = new DataTable("Data");
                dt.Columns.Add("File_Path");
                dt.Columns.Add("File_Name");   
                DataRow dr = dt.NewRow();
                dr["File_Path"] = strMovePath + strReplaceFileNM;
                dr["File_Name"] = strFileNM;

                dt.Rows.Add(dr);

                // 네트워크 로그아웃
                ctx.Undo();

                string strJson = Comm.NonEncryptMakeJson("Y", "", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                string strJson = Comm.NonEncryptMakeJson("N", e.Message);
                return Json(strJson);
                //return JavaScript("<script>alert('XML 파일 다운로드를 실패 하였습니다. ');console.log('"+e.Message+"')</script>");
            }
        }

        [HttpPost]
        /// <summary>
        /// XML 파일 다운로드
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnXmlFileDownload(JsonData value)
        {
            try
            {
                //fnDeleteXMLFile();

                // 새 사용자 임시 로그온 하기
                //IntPtr token = WndLogin.LogonUser("evbAdmin", "yjit1231!", ".", LogonType.LOGON32_LOGON_NETWORK_CLEARTEXT, LogonProvider.LOGON32_PROVIDER_DEFAULT);
                IntPtr token = WndLogin.LogonUser("evbWeb", "yjiT1q2w!@", ".", LogonType.LOGON32_LOGON_NETWORK_CLEARTEXT, LogonProvider.LOGON32_PROVIDER_DEFAULT);
                WindowsIdentity identity = new WindowsIdentity(token);
                WindowsImpersonationContext ctx = identity.Impersonate();
                
                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(value.vJsonData);

                string strNowFilePath = @"" + System.Configuration.ConfigurationManager.AppSettings["FilePath"].ToString() + dt.Rows[0]["XML_Path"].ToString(); //XML 경로                

                string strMovePath = Server.MapPath("~/Files/XML/") + "";

                DirectoryInfo dic = new DirectoryInfo(strMovePath);
                if (dic.Exists == false)
                {
                    dic.Create();
                }

                string strNowFileNM = Path.GetFileName(strNowFilePath);

                // 파일 복사
                System.IO.File.Copy(strNowFilePath, strMovePath+strNowFileNM, true);

                dt = new DataTable("Data");                
                dt.Columns.Add("File_Path");
                dt.Columns.Add("File_Name");
                DataRow dr = dt.NewRow();
                dr["File_Path"] = strMovePath + strNowFileNM;
                dr["File_Name"] = strNowFileNM;
                dt.Rows.Add(dr);

                // 네트워크 로그아웃
                ctx.Undo();

                string strJson = Comm.NonEncryptMakeJson("Y", "", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {                
                string strJson = Comm.NonEncryptMakeJson("N", e.Message);
                return Json(strJson);
                //return JavaScript("<script>alert('XML 파일 다운로드를 실패 하였습니다. ');console.log('"+e.Message+"')</script>");
            }
        }
        
        [HttpPost]
        /// <summary>
        /// 로컬에 다운받은 XML 삭제 기능
        /// </summary>
        public void fnDeleteXMLFile()
        {            
            string strPath = Server.MapPath("~/Files/XML/") + "";

            DirectoryInfo dir = new DirectoryInfo(strPath);

            System.IO.FileInfo[] files = dir.GetFiles("*.*",SearchOption.AllDirectories);

            foreach (System.IO.FileInfo file in files)
            {
                file.Delete();
            }
        }

        [HttpPost]
        /// <summary>
        /// 로컬에 다운받은 XML 삭제 기능
        /// </summary>
        public void fnDeleteFile()
        {
            string strPath = Server.MapPath("~/Files/Download/") + "";

            DirectoryInfo dir = new DirectoryInfo(strPath);

            System.IO.FileInfo[] files = dir.GetFiles("*.*", SearchOption.AllDirectories);

            foreach (System.IO.FileInfo file in files)
            {
                file.Delete();
            }
        }
    }
}
