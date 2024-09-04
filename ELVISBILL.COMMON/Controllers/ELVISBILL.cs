using ELVISBILL.COMMON.YJIT_Utils;
using ELVISBILL.COMMON.Query.ELVISBILL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ELVISPRIME.DATA;
using Newtonsoft.Json;

namespace ELVISBILL.COMMON.Controllers
{
    public class ELVISBILL
    {
        //객체 선언
        Encryption String_Encrypt = new Encryption(); //암호화
        Common comm = new Common(); //일반 함수 
        EDOC_Query EQ = new EDOC_Query(); //Edoc Query 
        MYEDOC_Query EMQ = new MYEDOC_Query(); //MyEdoc Query 
        Login_Query LQ = new Login_Query();

        //전역변수 선언
        string rtnJson = "";
        DataTable dt = new DataTable();


        #region ★★★★★★Login★★★★★

        public string fnUpdateMyPW(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);
            int nResult = 0;
            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                //국세청 승인 Stauts 변경
                nResult = DataHelper.ExecuteNonQuery(LQ.UpdateUserPw(dt.Rows[0]), CommandType.Text);

                if (nResult == 1)
                {
                        rtnJson = comm.MakeJson("Y", "");

                }
                else
                {
                    rtnJson = comm.MakeJson("N", "Update가 되지 않았습니다.");
                }

                return rtnJson;
            }
            catch(Exception e)
            {
                rtnJson = comm.MakeJson("E", e.Message);
                return rtnJson;
            }
        }


        public string fnCheckLogin(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);
            DataTable Resultdt = new DataTable();
            DataTable Totaldt = new DataTable();

            DataHelper.ConnectionString_Select = "BILL";
            try
            {
                Resultdt = DataHelper.ExecuteDataTable(LQ.GetUsrfno(dt.Rows[0]), CommandType.Text);
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
                rtnJson = comm.MakeJson("E", e.Message);
                return rtnJson;
            }
        }

        /// <summary>
        /// 사업자 번호 체크
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnCheckCrn(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(LQ.fnCheckCrn(dt.Rows[0]), CommandType.Text);
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnExampleTaxPrint(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetExampleTaxPrintData(dt.Rows[0]), CommandType.Text);
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


        /// <summary>
        /// 
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnTaxPrint(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";
            DataTable Resultdt = new DataTable();

            try
            {
                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetTaxPrintData(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "Data";

                if (Resultdt.Rows.Count == 0)
                {
                    rtnJson = comm.MakeJson("N", "", Resultdt);
                }
                else
                {
                    //LOG 데이터
                    DataHelper.ExecuteNonQuery(EQ.fnLog_GetTaxPrint_SELECT(dt.Rows[0], "fnGetTaxPrintData"), CommandType.Text);

                    rtnJson = comm.MakeJson("Y", "", Resultdt);
                }

                return rtnJson;
            }
            catch (Exception e)
            {
                //만약 오류가 발생 하였을 경우
                rtnJson = comm.MakeJson("E", e.Message, Resultdt);
                return rtnJson;
            }
        }


        /// <summary>
        /// 일반입금표
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnCreateSlip(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetCreateSlip(dt.Rows[0]), CommandType.Text);
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

        /// <summary>
        /// 대리점 입금표
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnKeep_CreateSlip(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetKeep_CreateSlip(dt.Rows[0]), CommandType.Text);
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

        /// <summary>
        /// 세금계산서 프린트 하기 전.
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public void fnTaxPrint_PRINT(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataHelper.ExecuteNonQuery(EQ.fnLog_GetTaxPrint_PRINT(dt.Rows[0]), CommandType.Text);
            }
            catch (Exception e)
            {
                Console.WriteLine();
            }
        }

        /// <summary>
        /// 세금계산서 프린트 하기 전.
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public void fnTaxPrint_END(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataHelper.ExecuteNonQuery(EQ.fnLog_GetTaxPrint_END(dt.Rows[0]), CommandType.Text);
            }
            catch (Exception e)
            {
                Console.WriteLine();
            }
        }


        #endregion

        #region ★★★★★★ Edoc ★★★★★★
        /// <summary>
        /// Edoc 검색 결과 리스트 가져오기
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnGetSearchList(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();
                DataTable Totaldt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetEdocList(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "List";

                Totaldt = DataHelper.ExecuteDataTable(EQ.fnGetEdocList_Total(dt.Rows[0]), CommandType.Text);
                Totaldt.TableName = "Total";
                
                if (Resultdt.Rows.Count == 0)
                {
                    //rtnJson = comm.MakeJson("N", "", Resultdt);
                    rtnJson = comm.MakeJson(comm.MakeResultDT("N", ""), Resultdt, Totaldt);
                }
                else
                {
                    //rtnJson = comm.MakeJson("Y", "", Resultdt);
                    rtnJson = comm.MakeJson(comm.MakeResultDT("Y", ""), Resultdt, Totaldt);
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
        
        /// <summary>
        /// Edoc 검색 결과 리스트 가져오기
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnGetSearchList_ReFresh(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();
                DataTable Totaldt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetEdocList_Refresh(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "List";

                Totaldt = DataHelper.ExecuteDataTable(EQ.fnGetEdocList_Total(dt.Rows[0]), CommandType.Text);
                Totaldt.TableName = "Total";

                if (Resultdt.Rows.Count == 0)
                {
                    //rtnJson = comm.MakeJson("N", "", Resultdt);
                    rtnJson = comm.MakeJson(comm.MakeResultDT("N", ""), Resultdt, Totaldt);
                }
                else
                {
                    //rtnJson = comm.MakeJson("Y", "", Resultdt);
                    rtnJson = comm.MakeJson(comm.MakeResultDT("Y", ""), Resultdt, Totaldt);
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


        /// <summary>
        /// 레이어팝업 세금계산서 상세내역
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnGetTaxSearchData(string strValue)
        {
            string rtnJson = "";
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Datadt = new DataTable();
                DataTable Listdt = new DataTable();
                DataTable Docdt = new DataTable();
                DataTable Attachdt = new DataTable();

                //세금계산서 데이터
                Datadt = DataHelper.ExecuteDataTable(EQ.fnGetTaxData(dt.Rows[0]), CommandType.Text);
                Datadt.TableName = "Data";

                //세금계산서 내역
                Listdt = DataHelper.ExecuteDataTable(EQ.fnGetTaxList(dt.Rows[0]), CommandType.Text);
                Listdt.TableName = "List";

                //세금계산서 연계문서 
                Docdt = DataHelper.ExecuteDataTable(EQ.fnGetTaxDoc(dt.Rows[0]), CommandType.Text);
                Docdt.TableName = "Doc";

                //세금계산서 첨부파일 리스트
                Attachdt = DataHelper.ExecuteDataTable(EQ.fnGetTaxAttach(dt.Rows[0]), CommandType.Text);
                Attachdt.TableName = "Attach";

                if (Datadt.Rows.Count == 0)
                {
                    rtnJson = comm.MakeJson("N", "", Datadt);                    
                }
                else
                {
                    //예외 케이스라서 여기만 다르게
                    DataSet ds = new DataSet();
                    DataTable ResultDT = comm.MakeResultDT("Y", "");
                    ResultDT.TableName = "Result";
                    ds.Tables.Add(ResultDT);
                    ds.Tables.Add(Datadt);
                    ds.Tables.Add(Listdt);
                    ds.Tables.Add(Docdt);
                    ds.Tables.Add(Attachdt);

                    rtnJson = JsonConvert.SerializeObject(ds, Formatting.Indented);

                    rtnJson = String_Encrypt.encryptAES256(rtnJson);
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
        
        
        /// <summary>
        /// 레이어팝업 입금표
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnGetCreditSearchData(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();
                DataTable Totaldt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EQ.fnGetCreditData(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "Data";

                Totaldt = DataHelper.ExecuteDataTable(EQ.fnGetCreditList(dt.Rows[0]), CommandType.Text);
                Totaldt.TableName = "List";

                if (Resultdt.Rows.Count == 0)
                {
                    //rtnJson = comm.MakeJson("N", "", Resultdt);
                    rtnJson = comm.MakeJson(comm.MakeResultDT("N", ""), Resultdt, Totaldt);
                }
                else
                {
                    //rtnJson = comm.MakeJson("Y", "", Resultdt);
                    rtnJson = comm.MakeJson(comm.MakeResultDT("Y", ""), Resultdt, Totaldt);
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

        /// <summary>
        /// 국세청 승인 컨트롤러
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnSetApproval(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);
            int nResult = 0;
            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                //국세청 승인 Stauts 변경
                nResult = DataHelper.ExecuteNonQuery(EQ.fnSetApproval_Update(dt.Rows[0]), CommandType.Text);

                if(nResult == 1)
                {
                    nResult = DataHelper.ExecuteNonQuery(EQ.fnSetApproval_Insert(dt.Rows[0]), CommandType.Text);

                    if (nResult == 1)
                    {
                        rtnJson = comm.MakeJson("Y", "");
                    }               
                    else
                    {
                        rtnJson = comm.MakeJson("N", "Insert가 되지 않았습니다.");
                    }                    
                }
                else
                {
                    rtnJson = comm.MakeJson("N", "Update가 되지 않았습니다.");
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

        /// <summary>
        /// 국세청 승인 컨트롤러
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnSetAllApproval(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);
            int nResult = 0;
            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                string strTAX_DOC_NO = dt.Rows[0]["TAX_DOC_NO"].ToString();
                string[] SplitTAX_DOC_NO = strTAX_DOC_NO.Split(',');

                int nUpdateFailCount = 0;
                int nInsertFailCount = 0;

                for (int i = 0; SplitTAX_DOC_NO.Length>i;i++)
                {
                    //국세청 승인 Stauts 변경
                    nResult = DataHelper.ExecuteNonQuery(EQ.fnSetApproval_Update(SplitTAX_DOC_NO[i]), CommandType.Text);

                    if (nResult == 1)
                    {
                        nResult = DataHelper.ExecuteNonQuery(EQ.fnSetApproval_Insert(SplitTAX_DOC_NO[i]), CommandType.Text);

                        if (nResult == 0)
                        {
                            nInsertFailCount++;
                        }
                    }
                    else
                    {
                        nUpdateFailCount++;
                    }
                }

                if(nInsertFailCount != 0 || nUpdateFailCount != 0)
                {
                    string vText = "Insert :" + nInsertFailCount + " Update :" + nUpdateFailCount;
                    rtnJson = comm.MakeJson("N", vText);
                }
                else
                {
                    rtnJson = comm.MakeJson("Y", "");
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

        /// <summary>
        /// 국세청 거절 컨트롤러
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnSetRefuse(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);
            int nResult = 0;

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                //국세청 거절 Stauts 변경
                nResult = DataHelper.ExecuteNonQuery(EQ.fnSetRefuse_Update(dt.Rows[0]), CommandType.Text);

                if (nResult == 1)
                {
                    //국세청 거절 Insert 
                    nResult = DataHelper.ExecuteNonQuery(EQ.fnSetRefuse_Insert(dt.Rows[0]), CommandType.Text);

                    if (nResult == 1)
                    {
                        rtnJson = comm.MakeJson("Y", "");
                    }
                    else
                    {
                        rtnJson = comm.MakeJson("N", "Insert가 되지 않았습니다.");
                    }
                }
                else
                {
                    rtnJson = comm.MakeJson("N", "Update가 되지 않았습니다.");
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


        #endregion

        #region ★★★★★★MyEdoc★★★★★★
        /// <summary>
        /// Edoc 검색 결과 리스트 가져오기
        /// </summary>
        /// <param name="strValue"></param>
        /// <returns></returns>
        public string fnGetMySearchList(string strValue)
        {
            string strResult = String_Encrypt.decryptAES256(strValue);

            //데이터
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            DataHelper.ConnectionString_Select = "BILL";

            try
            {
                DataTable Resultdt = new DataTable();
                DataTable Totaldt = new DataTable();

                Resultdt = DataHelper.ExecuteDataTable(EMQ.fnGetMyEdocList(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "List";


                //if(Resultdt.Rows.Count == 0)
                //{
                //    rtnJson = comm.MakeJson("N", "", Resultdt);
                //}
                //else
                //{
                //    rtnJson = comm.MakeJson("Y", "", Resultdt);
                //}


                #region 쿼리 생성 후 해제해야함
                if (dt.Rows[0]["NEW_SEARCH"].ToString() == "1") //검색버튼 사용시에만
                {
                    Totaldt = DataHelper.ExecuteDataTable(EMQ.fnMyEdocList_Total(dt.Rows[0]), CommandType.Text);
                    Totaldt.TableName = "Total";
                }

                if (Resultdt.Rows.Count == 0)
                {
                    if (dt.Rows[0]["NEW_SEARCH"].ToString() == "1") //검색버튼 클릭시
                    {
                        rtnJson = comm.MakeJson(comm.MakeResultDT("N", ""), Resultdt, Totaldt);
                    }
                    else // 이외의 버튼으로 조회시
                    {
                        rtnJson = comm.MakeJson("N", "", Resultdt);
                    }


                }
                else
                {
                    if (dt.Rows[0]["NEW_SEARCH"].ToString() == "1") //검색버튼 클릭시
                    {
                        rtnJson = comm.MakeJson(comm.MakeResultDT("Y", ""), Resultdt, Totaldt);
                    }
                    else // 이외의 버튼으로 조회시
                    {
                        rtnJson = comm.MakeJson("Y", "", Resultdt);
                    }

                }
                #endregion
                return rtnJson;
            }
            catch (Exception e)
            {
                //만약 오류가 발생 하였을 경우
                rtnJson = comm.MakeJson("E", e.Message);
                return rtnJson;
            }
        }
        #endregion



        
    }
}
