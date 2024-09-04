using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Text;
using System.Collections;
using Newtonsoft.Json;

namespace ELVISBILL.COMMON.YJIT_Utils
{
    public class Common
    {
        Encryption String_Encrypt = new Encryption();

        /// <summary>
		/// other DB connection
		/// </summary>
		/// <param name="dr">Need to Domain , user Id , password</param>
		/// <returns></returns>
        public string DBConnection(DataRow dr)
        {
            string sql = "Data Source=" + dr["DOMAIN"].ToString() + ";User Id=" + dr["USR_ID"] + ";Password=" + dr["USR_PWD"] + ";Integrated Security=no;Connection Lifetime=0;Min Pool Size=0;Max Pool Size=100;Pooling=true;Unicode=true";
            return sql;
        }

        public string DBConnection(string strDomain, string strDomainID, string strDomainPwd)
        {
            string sql = "Data Source=" + strDomain + ";User Id=" + strDomainID + ";Password=" + strDomainPwd + ";Integrated Security=no;Connection Lifetime=0;Min Pool Size=0;Max Pool Size=100;Pooling=true;Unicode=true";
            return sql;
        }

        /// <summary>
        /// other DB connection 
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string DBConnection_New(DataRow dr)
        {
            string sql = "Data Source=" + dr["DOMAIN"] + ";User Id=" + dr["USR_ID"] + ";Password=" + dr["USR_PWD"] + ";Integrated Security=no;Connection Lifetime=0;Min Pool Size=0;Max Pool Size=100;Pooling=true;Unicode=true";
            return sql;
        }

        ///// <summary>
        ///// Prime_DB Connection
        ///// </summary>
        ///// <returns></returns>
        //public string PrimeDBConnection()
        //{
        //    string sql = System.Configuration.ConfigurationManager.ConnectionStrings["PRIME_ORACLE"].ConnectionString;

        //    return sql;
        //}

        public string MakeJson(string status, string Msg)
        {
            try
            {
                string json = "";
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = status;
                row1["trxMsg"] = Msg;
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                json = String_Encrypt.encryptAES256(JsonConvert.SerializeObject(ds, Formatting.Indented));
                return json;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }


        public string MakeJson(string status, string Msg, DataTable args)
        {
            try
            {
                string json = "";
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = status;
                row1["trxMsg"] = Msg;
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                //if (status != "E" && args.Rows.Count > 0)
                if (args.Rows.Count > 0)
                {
                    ds.Tables.Add(args);
                }
                string strValue = JsonConvert.SerializeObject(ds);

                //암호화 로직 추가 
                //json = JsonConvert.SerializeObject(String_Encrypt.encryptAES256(strValue)); 
                //json = String_Encrypt.encryptAES256(strValue.Replace(Environment.NewLine, "")); 
                json = String_Encrypt.encryptAES256(strValue);
                //json = strValue; 
                return json;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string NonEncryptMakeJson(string status, string Msg, DataTable args)
        {
            try
            {
                string json = "";
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = status;
                row1["trxMsg"] = Msg;
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                if (status != "E" && args.Rows.Count > 0)
                {
                    ds.Tables.Add(args);
                }
                string strValue = JsonConvert.SerializeObject(ds);

                //암호화 로직 추가 
                //json = JsonConvert.SerializeObject(String_Encrypt.encryptAES256(strValue)); 
                //json = String_Encrypt.encryptAES256(strValue.Replace(Environment.NewLine, "")); 
                //json = String_Encrypt.encryptAES256(strValue);
                json = strValue; 
                return json;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string NonEncryptMakeJson(string status, string Msg)
        {
            try
            {
                string json = "";
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = status;
                row1["trxMsg"] = Msg;
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                json = JsonConvert.SerializeObject(ds);
                return json;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string MakeNonJson(string status, string Msg, DataTable args)
        {
            try
            {
                string json = "";
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = status;
                row1["trxMsg"] = Msg;
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                if (status != "E" && args.Rows.Count > 0)
                {
                    ds.Tables.Add(args);
                }
                string strValue = JsonConvert.SerializeObject(ds);

                //암호화 로직 추가 
                //json = JsonConvert.SerializeObject(String_Encrypt.encryptAES256(strValue)); 
                //json = String_Encrypt.encryptAES256(strValue.Replace(Environment.NewLine, "")); 
                json = strValue;
                return json;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        //public string MakeJson(string status, string Msg, DataTable args)
        //{
        //    try
        //    {
        //        string json = "";

        //        DataSet ds = new DataSet();
        //        DataTable dt = new DataTable();
        //        dt.Columns.Add("trxCode");
        //        dt.Columns.Add("trxMsg");
        //        DataRow row1 = dt.NewRow();
        //        row1["trxCode"] = status;
        //        row1["trxMsg"] = Msg;
        //        dt.Rows.Add(row1);
        //        dt.TableName = "Result";
        //        ds.Tables.Add(dt);
        //        if (status != "E" && args.Rows.Count > 0)
        //        {
        //            ds.Tables.Add(args);
        //        }
        //        json = JsonConvert.SerializeObject(ds, Formatting.Indented);
        //        return json;
        //    }
        //    catch(Exception e)
        //    {
        //        return e.Message;
        //    }            
        //}

        /// <summary>
        /// 결과값 DT로 만들어 주는 함수
        /// </summary>
        /// <param name="status"></param>
        /// <param name="Msg"></param>
        /// <returns></returns>
        public DataTable MakeResultDT(string status, string Msg)
        {

            DataTable dt = new DataTable();
            dt.Columns.Add("trxCode");
            dt.Columns.Add("trxMsg");
            DataRow row1 = dt.NewRow();
            row1["trxCode"] = status;
            row1["trxMsg"] = Msg;
            dt.Rows.Add(row1);
            dt.TableName = "Result";

            return dt;
        }


        /// <summary>
        /// return DS
        /// </summary>
        /// <param name="Result">MakeResultDT를 써서 가져온 DataTable을 넣어주면 됨.</param>
        /// <param name="DT1">병합할 DataTable 첫번째</param>
        /// <param name="DT2">병합할 DataTable 두번째</param>
        /// <returns></returns>
        public string MakeJson(DataTable Result, DataTable DT1, DataTable DT2)
        {

            string strJson = "";

            try
            {
                DataSet ds = new DataSet();
                if (DT1.TableName == DT2.TableName)
                {
                    DT1.TableName = DT1.TableName + "1";
                    DT2.TableName = DT2.TableName + "2";
                }

                Result.TableName = "Result";
                ds.Tables.Add(Result);
                ds.Tables.Add(DT1);
                ds.Tables.Add(DT2);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);

                strJson = String_Encrypt.encryptAES256(strJson);
            }
            catch (Exception e)
            {
                return e.Message;
            }

            return strJson;
        }

        public string MakeJson(DataTable Result, DataTable DT1)
        {

            string strJson = "";

            try
            {
                DataSet ds = new DataSet();
                ds.Tables.Add(Result);
                ds.Tables.Add(DT1);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);

                strJson = String_Encrypt.encryptAES256(strJson);
            }
            catch (Exception e)
            {
                return e.Message;
            }

            return strJson;
        }

        public string MakeNonJson(DataTable Result, DataTable DT1)
        {

            string strJson = "";

            try
            {
                DataSet ds = new DataSet();

                ds.Tables.Add(Result);
                ds.Tables.Add(DT1);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);

            }
            catch (Exception e)
            {
                return e.Message;
            }

            return strJson;
        }



        /// <summary>
        /// 랜덤 텍스트 가지고 오기 + 숫자
        /// </summary>
        /// <param name="numLength">텍스트 길이</param>
        /// <returns></returns>
        public string fnGetRandomString(int numLength)
        {

            string strResult = "";
            Random rand = new Random();
            string strRandomChar = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";

            StringBuilder rs = new StringBuilder();

            for (int i = 0; i < numLength; i++)
            {
                rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            }
            strResult = rs.ToString();

            return strResult;
        }

        //public static object dataSetToJSON(DataSet ds)
        //{
        //    ArrayList root = new ArrayList();
        //    List<Dictionary<string, object>> table;
        //    Dictionary<string, object> data;

        //    foreach (DataTable dt in ds.Tables)
        //    {
        //        table = new List<Dictionary<string, object>>();
        //        foreach (DataRow dr in dt.Rows)
        //        {
        //            data = new Dictionary<string, object>();
        //            foreach (DataColumn col in dt.Columns)
        //            {
        //                data.Add(col.ColumnName, dr[col]);
        //            }
        //            table.Add(data);
        //        }
        //        root.Add(table);
        //    }
        //    JavaScriptSerializer serializer = new JavaScriptSerializer();
        //    return serializer.Serialize(root);
        //} 


        /// <summary>
        /// 비밀번호 찾기 인증키 만들기
        /// </summary>
        /// <param name="numLength">텍스트 길이</param>
        /// <returns></returns>
        public string fnGetConfirmKey()
        {

            string strResult = "";
            Random rand = new Random();
            string strRandomChar = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
            string strRandomNum = "1234567890";
            string strRandomSC = "!@$%^()";

            StringBuilder rs = new StringBuilder();

            //특수문자 1 + 문자 3 + 숫자 1 + 문자 3 + 특수문자 1
            rs.Append(strRandomSC[(int)(rand.NextDouble() * strRandomSC.Length)]);
            rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            rs.Append(strRandomNum[(int)(rand.NextDouble() * strRandomNum.Length)]);
            rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            rs.Append(strRandomChar[(int)(rand.NextDouble() * strRandomChar.Length)]);
            rs.Append(strRandomSC[(int)(rand.NextDouble() * strRandomSC.Length)]);

            strResult = rs.ToString();

            return strResult;
        }
    }
}
