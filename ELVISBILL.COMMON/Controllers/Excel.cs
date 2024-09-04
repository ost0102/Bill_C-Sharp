using ELVISBILL.COMMON.YJIT_Utils;
using ELVISBILL.COMMON.Query.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ELVISPRIME.DATA;
using Newtonsoft.Json;

namespace ELVISBILL.COMMON.Controllers
{
    public class Excel
    {
        Encryption String_Encrypt = new Encryption(); //암호화
        Common comm = new Common(); //일반 함수 
        Excel_Query EQ = new Excel_Query();

        //전역변수 선언
        string rtnJson = "";
        DataTable dt = new DataTable();

        /// <summary>
        /// 엑셀 select 데이터
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnGetExcelData(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();
                //원래
                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetExcelData(dt.Rows[0]), CommandType.Text);
                
                
                Resultdt.TableName = "Data";

                if (Resultdt.Rows.Count == 0)
                {
                    rtnJson = comm.MakeJson("N", "", Resultdt);
                }
                else
                {
                    rtnJson = comm.MakeJson("Y", "", Resultdt);
                }

                return rtnJson;
            }
            catch (Exception e)
            {
                //만약 오류가 발생 하였을 경우
                rtnJson = comm.MakeJson("E", e.Message);
                return rtnJson;
            }
        }



        public string fnGetAllExcelData(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetAllExcelData(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "Data";

                if (Resultdt.Rows.Count == 0)
                {
                    rtnJson = comm.MakeJson("N", "", Resultdt);
                }
                else
                {
                    rtnJson = comm.MakeJson("Y", "", Resultdt);
                }

                return rtnJson;
            }
            catch (Exception e)
            {
                //만약 오류가 발생 하였을 경우
                rtnJson = comm.MakeJson("E", e.Message);
                return rtnJson;
            }
        }
    }
}
