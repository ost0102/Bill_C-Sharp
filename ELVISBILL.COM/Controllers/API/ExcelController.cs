using ELVISBILL.COMMON.Controllers;
using ELVISBILL.COMMON.YJIT_Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;

using OfficeOpenXml;
using System.Drawing;
using OfficeOpenXml.Style;

namespace ELVISBILL.COM.Controllers.API
{
    public class ExcelController : Controller
    {
        //
        // GET: /Excel/
        Encryption ec = new Encryption(); //DB_Data - Encryption 
        Common comm = new Common(); //일반 함수 
        string strJson = "";
        string strResult = "";
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        Excel EB = new Excel();

        //엑셀 데이터 받아서 엑셀 생성하고 다운로드 받는 로직
        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        public class JsonGetData
        {
            public string strEXCEL_FILENM { get; set; }
            public string strEXCEL_PATH { get; set; }
        }

        /// <summary>
        /// 엑셀을 생성한다.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        //public ActionResult DownloadExcel(JsonData value)
        //{
        //    //DataTable

        //    //데이터를 가지고 와서 엑셀로 만들어준다.

        //    try
        //    {
        //        string vJsonData = value.vJsonData.ToString();
        //        string vEncodeData = "";

        //        //암호화 걸기
        //        vEncodeData = ec.encryptAES256(vJsonData);

        //        strResult = EB.fnGetExcelData(vEncodeData);

        //        strJson = ec.decryptAES256(strResult);

        //        ds = JsonConvert.DeserializeObject<DataSet>(strJson);

        //        ////파일저장 및 dataset 엑셀 저장
        //        string strDateTime = strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF");
        //        string strPath = "Files/Excel/";
        //        string strRealPath = Server.MapPath("~/Files/Excel/") + strDateTime + ".xlsx";

        //        if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "Y")
        //        {
        //            //엑셀 생성   
        //            using (ExcelPackage pck = new ExcelPackage())
        //            {
        //                ExcelWorksheet workSheet = pck.Workbook.Worksheets.Add(ds.Tables["Data"].TableName);
        //                workSheet.Cells["A1"].LoadFromDataTable(ds.Tables["Data"], true);

        //                pck.SaveAs(new FileInfo(strRealPath));
        //            }

        //            //DT 생성 (경로 생성)
        //            dt.Clear();
        //            dt = new DataTable("FILE_UPLOAD");
        //            dt.Columns.Add("EXCEL_FILENM");
        //            dt.Columns.Add("EXCEL_PATH");

        //            DataRow dr;
        //            dr = dt.NewRow();
        //            dr["EXCEL_FILENM"] = strDateTime;
        //            dr["EXCEL_PATH"] = strPath;

        //            dt.Rows.Add(dr);

        //            strResult = comm.MakeJson("Y", "Success", dt);
        //            strJson = ec.decryptAES256(strResult);
        //        }
        //        else if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "N")
        //        {
        //            strResult = comm.MakeJson("N", "Fail");
        //            strJson = ec.decryptAES256(strResult);
        //        }
        //        else if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "E")
        //        {
        //            strResult = comm.MakeJson("E", "Fail");
        //            strJson = ec.decryptAES256(strResult);
        //        }

        //        return Json(strJson);
        //    }
        //    catch (Exception e)
        //    {
        //        strJson = e.Message;
        //        return Json(strJson);
        //    }
        //}


        public ActionResult DownloadAllExcel(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnGetAllExcelData(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                ds = JsonConvert.DeserializeObject<DataSet>(strJson);

                ////파일저장 및 dataset 엑셀 저장
                string strDateTime = strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF");
                string strPath = "Files/Excel/";
                string strRealPath = Server.MapPath("~/Files/Excel/") + strDateTime + ".xlsx";

                if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "Y")
                {
                    //엑셀 생성   
                    using (ExcelPackage pck = new ExcelPackage())
                    {
                        ExcelWorksheet workSheet = pck.Workbook.Worksheets.Add("ELVIS_BILL");

                        Color DeepBlueHexCode = ColorTranslator.FromHtml("#c6efce");


                        #region Header 세팅
                        workSheet.Column(1).Width = 13;
                        workSheet.Column(2).Width = 13;
                        workSheet.Column(3).Width = 19;
                        workSheet.Column(4).Width = 13;
                        workSheet.Column(5).Width = 13;
                        workSheet.Column(6).Width = 13;
                        workSheet.Column(7).Width = 25;
                        workSheet.Column(8).Width = 20;
                        workSheet.Column(9).Width = 18;
                        workSheet.Column(10).Width = 18;
                        workSheet.Column(11).Width = 18;

                        workSheet.Column(1).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(2).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(3).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(4).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(5).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(6).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(7).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(8).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(9).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(10).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(11).Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                        workSheet.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(2).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(3).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(4).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(5).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(6).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(7).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(8).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(9).Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        workSheet.Column(10).Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        workSheet.Column(11).Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        //제목은 가운데 정렬 공급가액 , 세액 , 대납비용포함
                        workSheet.Cells["I1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Cells["J1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Cells["K1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        workSheet.Column(1).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(2).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(3).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(4).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(5).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(6).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(7).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(8).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(9).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(10).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));
                        workSheet.Column(11).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕", 10));

                        workSheet.Cells["A1:K1"].Style.Font.Bold = true;
                        workSheet.Cells["A1:K1"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        workSheet.Cells["A1:K1"].Style.Fill.BackgroundColor.SetColor(DeepBlueHexCode);

                        var nBorderRowCount = ds.Tables["Data"].Rows.Count + 1;
                        var nRowCount = ds.Tables["Data"].Rows.Count;
                        //테두리
                        string modelRange = "A1:K" + nBorderRowCount.ToString();

                        workSheet.Cells[modelRange].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        workSheet.Cells[modelRange].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        workSheet.Cells[modelRange].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        workSheet.Cells[modelRange].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                        string strDateFormat = "E1:F" + nRowCount.ToString();
                        workSheet.Cells[strDateFormat].Style.Numberformat.Format = "yyyy-MM-dd";
                        #endregion

                        workSheet.Cells["A1"].LoadFromDataTable(ds.Tables["Data"], true);

                        pck.SaveAs(new FileInfo(strRealPath));
                    }

                    //DT 생성 (경로 생성)
                    dt.Clear();
                    dt = new DataTable("FILE_UPLOAD");
                    dt.Columns.Add("EXCEL_FILENM");
                    dt.Columns.Add("EXCEL_PATH");

                    DataRow dr;
                    dr = dt.NewRow();
                    dr["EXCEL_FILENM"] = strDateTime;
                    dr["EXCEL_PATH"] = strPath;

                    dt.Rows.Add(dr);

                    strResult = comm.MakeJson("Y", "Success", dt);
                    strJson = ec.decryptAES256(strResult);
                }
                else if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "N")
                {
                    strResult = comm.MakeJson("N", "Fail");
                    strJson = ec.decryptAES256(strResult);
                }
                else if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "E")
                {
                    strResult = comm.MakeJson("E", "Fail");
                    strJson = ec.decryptAES256(strResult);
                }

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        public ActionResult DownloadExcel(JsonData value)
        {
            //DataTable

            //데이터를 가지고 와서 엑셀로 만들어준다. 

            try
            {
                string vJsonData = value.vJsonData.ToString();
                string vEncodeData = "";

                //암호화 걸기
                vEncodeData = ec.encryptAES256(vJsonData);

                strResult = EB.fnGetExcelData(vEncodeData);

                strJson = ec.decryptAES256(strResult);

                ds = JsonConvert.DeserializeObject<DataSet>(strJson);

                ////파일저장 및 dataset 엑셀 저장
                string strDateTime = strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF");
                string strPath = "Files/Excel/";
                string strRealPath = Server.MapPath("~/Files/Excel/") + strDateTime + ".xlsx";

                if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "Y")
                {
                    //엑셀 생성   
                    using (ExcelPackage pck = new ExcelPackage())
                    {
                        ExcelWorksheet workSheet = pck.Workbook.Worksheets.Add("ELVIS_BILL");

                        Color DeepBlueHexCode = ColorTranslator.FromHtml("#c6efce");

                        //Header 세팅
                        workSheet.Column(1).Width = 13;
                        workSheet.Column(2).Width = 13;
                        workSheet.Column(3).Width = 19;
                        workSheet.Column(4).Width = 13;
                        workSheet.Column(5).Width = 13;
                        workSheet.Column(6).Width = 13;
                        workSheet.Column(7).Width = 25;
                        workSheet.Column(8).Width = 20;
                        workSheet.Column(9).Width = 18;
                        workSheet.Column(10).Width = 18;
                        workSheet.Column(11).Width = 18;

                        workSheet.Column(1).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(2).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(3).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(4).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(5).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(6).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(7).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(8).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(9).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(10).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        workSheet.Column(11).Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                        workSheet.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(2).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(3).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(4).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(5).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(6).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(7).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(8).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Column(9).Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        workSheet.Column(10).Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        workSheet.Column(11).Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        //제목은 가운데 정렬 공급가액 , 세액 , 대납비용포함
                        workSheet.Cells["I1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Cells["J1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Cells["K1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        workSheet.Column(1).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(2).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(3).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(4).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(5).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(6).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(7).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(8).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(9).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(10).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));
                        workSheet.Column(11).Style.Font.SetFromFont(new System.Drawing.Font("나눔고딕",10));

                        workSheet.Cells["A1:K1"].Style.Font.Bold = true; 
                        workSheet.Cells["A1:K1"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        workSheet.Cells["A1:K1"].Style.Fill.BackgroundColor.SetColor(DeepBlueHexCode);

                        var nBorderRowCount = ds.Tables["Data"].Rows.Count+1;
                        var nRowCount = ds.Tables["Data"].Rows.Count;
                        //테두리
                        string modelRange = "A1:K" + nBorderRowCount.ToString();

                        workSheet.Cells[modelRange].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        workSheet.Cells[modelRange].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        workSheet.Cells[modelRange].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        workSheet.Cells[modelRange].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                        string strDateFormat = "E1:F"+ nRowCount.ToString();
                        workSheet.Cells[strDateFormat].Style.Numberformat.Format = "yyyy-MM-dd";

                        //string strWonFormat = "I1:K"+ nRowCount.ToString();
                        //workSheet.Cells[strWonFormat].Style.Numberformat.Format = ",###";

                        //ExcelWorksheet workSheet = pck.Workbook.Worksheets.Add(ds.Tables["Data"].TableName);
                        workSheet.Cells["A1"].LoadFromDataTable(ds.Tables["Data"], true);

                        pck.SaveAs(new FileInfo(strRealPath));
                    }

                    //DT 생성 (경로 생성)
                    dt.Clear();
                    dt = new DataTable("FILE_UPLOAD");
                    dt.Columns.Add("EXCEL_FILENM");
                    dt.Columns.Add("EXCEL_PATH");

                    DataRow dr;
                    dr = dt.NewRow();
                    dr["EXCEL_FILENM"] = strDateTime;
                    dr["EXCEL_PATH"] = strPath;

                    dt.Rows.Add(dr);

                    strResult = comm.MakeJson("Y", "Success", dt);
                    strJson = ec.decryptAES256(strResult);
                }
                else if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "N")
                {
                    strResult = comm.MakeJson("N", "Fail");
                    strJson = ec.decryptAES256(strResult);
                }
                else if (ds.Tables["Result"].Rows[0]["trxCode"].ToString() == "E")
                {
                    strResult = comm.MakeJson("E", "Fail");
                    strJson = ec.decryptAES256(strResult);
                }

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
		/// 파일 DOWNLOAD
		/// </summary>
		/// <param name="value"></param>
		/// <returns></returns>
		[HttpGet]
        public ActionResult Down_ExcelFile(JsonGetData value)
        {
            string strFile_NM = value.strEXCEL_FILENM;
            string strFile_Path = value.strEXCEL_PATH;

            //파일이 있는지 확인 후 다운로드
            try
            {
                System.IO.FileInfo fi;

                fi = new System.IO.FileInfo(Server.MapPath("~/" + strFile_Path + "/") + strFile_NM + ".xlsx");

                if (fi.Exists)
                {
                    return File(fi.FullName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Excel.xlsx");
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
        /// 생성했던 엑셀을 지운다.
        /// </summary>
        /// <param name="value"></param>
        public void Del_ExcelFile(JsonData value)
        {
            DataTable dt = new DataTable();

            dt = JsonConvert.DeserializeObject<DataTable>(value.vJsonData);

            System.IO.FileInfo fi;

            fi = new System.IO.FileInfo(Server.MapPath("~/" + dt.Rows[0]["EXCEL_PATH"] + "/") + dt.Rows[0]["EXCEL_FILENM"] + ".xlsx");

            if (fi.Exists)
            {
                fi.Delete();
            }
        }
    }
}
