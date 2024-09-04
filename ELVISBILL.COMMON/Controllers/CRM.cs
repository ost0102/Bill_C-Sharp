using ELVISBILL.COMMON.YJIT_Utils;
using ELVISBILL.COMMON.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ELVISPRIME.DATA;
using ELVISBILL.COMMON.Query.CRM;
using Newtonsoft.Json;

namespace ELVISBILL.COMMON.Controllers
{
    public class CRM
    {
        //객체 선언
        Encryption String_Encrypt = new Encryption(); //암호화
        Common comm = new Common(); //일반 함수 
        Notice_Query CQ = new Notice_Query(); //쿼리 함수
        
        //전역변수 선언
        string rtnJson = "";
        DataTable dt = new DataTable();
        DataTable Resultdt = new DataTable();

        /// <summary>
        /// 메인 - 공지사항 리스트 가져오는 로직
        /// </summary>
        /// <returns></returns>
        public string fnGetNoticeList(string strValue)
        {
            string rtnJson = "";
            string strResult = String_Encrypt.decryptAES256(strValue);
           
            DataHelper.ConnectionString_Select = "CRM";

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = DataHelper.ExecuteDataTable(CQ.GetNoticeList(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "Table";

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
            catch(Exception e)
            {
                //만약 오류가 발생 하였을 경우
                rtnJson = comm.MakeJson("E", e.Message);
                rtnJson = String_Encrypt.decryptAES256(rtnJson);
                return rtnJson;
            }
        }

        public string fnGetNoticeListData(string strValue)
        {
            
            string strResult = String_Encrypt.decryptAES256(strValue);
            DataHelper.ConnectionString_Select = "CRM";

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = DataHelper.ExecuteDataTable(CQ.GetNoticeListData(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "Table";

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
                rtnJson = String_Encrypt.decryptAES256(rtnJson);
                return rtnJson;
            }
        }
    }
}
