using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;

namespace ELVISBILL.COMMON.Query.API
{
    public class Excel_Query
    {
        string sqlstr;

        public string fnGetExcelData(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT ";
            sqlstr += "     C1.COM_NM As 문서종류 ";
            sqlstr += "     , C2.COM_NM As 문서상태 ";
            sqlstr += "     , A.TAX_MGMT_NO As 계산서번호";
            sqlstr += "     , (CASE WHEN A.ETAXBIL_CL_CD IN ('01', '02') THEN  ";
            sqlstr += "                     (CASE WHEN A.ETAXBIL_KND_CD = '01' THEN '과세' ";
            sqlstr += "                               WHEN A.ETAXBIL_KND_CD = '02' THEN '영세' ";
            sqlstr += "                                WHEN A.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr += "                                ELSE '수입' END) ";
            sqlstr += "                ELSE ";
            sqlstr += "                     (CASE WHEN A.ETAXBIL_KND_CD = '01' THEN '계산서' ";
            sqlstr += "                               WHEN A.ETAXBIL_KND_CD = '02' THEN '계산서' ";
            sqlstr += "                                WHEN A.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr += "                                ELSE '수입' END) ";
            sqlstr += "                END)  As 부가가치세 ";
            sqlstr += "     , TO_CHAR(TO_DATE(A.WRITE_DT),'YYYY-MM-DD')  AS 작성일자 ";
            sqlstr += "     , TO_CHAR(TO_DATE(SUBSTR (A.ISU_DATE, 1, 8)),'YYYY-MM-DD')  AS 발급일자 ";
            sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.TRADE_NM) As 공급받는자상호 ";
            sqlstr += "     , A.BL_NO ";
            sqlstr += "     ,TO_CHAR ((TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.SUP_SM_AMT))), 'FM999,999,999,999,990') AS 공급가액 ";
            sqlstr += "     ,TO_CHAR ((TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.VAT_SM_AMT))), 'FM999,999,999,999,990') AS 세액   ";
            sqlstr += "     ,TO_CHAR ((TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.TOT_AMT))), 'FM999,999,999,999,990')  AS 대납비용포함 ";
            sqlstr += " FROM ELVISBILL.EVB_TAX_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B1 ON A.TAX_DOC_NO = B1.TAX_DOC_NO AND B1.BUSN_KND_CD = '01' ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B2 ON A.TAX_DOC_NO = B2.TAX_DOC_NO AND B2.BUSN_KND_CD = '02' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C1 ON A.ETAXBIL_CL_CD = C1.COM_CD AND C1.GRP_CD = 'ETAXBIL_CL_CD' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C2 ON A.LAST_DOC_STATUS = C2.COM_CD AND C2.GRP_CD = 'ETAX_RCPT_CD' ";
            if (dr["SearchType"].ToString() == "E")
            {
                sqlstr += " INNER JOIN ELVISBILL.EVB_DOC_INFO D ON A.TAX_DOC_NO =D.DOC_NO AND D.DOC_TYPE ='TAX' ";
            }

            sqlstr += "WHERE 1=1";

            sqlstr += "    AND ELVISBILL.CRYPTO_AES256.DEC_AES(A.DMDER_BUSN_ID) = '" + dr["CRN_NO"].ToString() + "' ";             /*-- 사업자번호*/

            /*-- 문서종류 체크 여부 or 1=0*/
            if (dr["ContentType"].ToString() == "B")
            {
                // 번호기준(N) / 담당자(S) / 이메일(E)
                if (dr["SearchType"].ToString() == "N")
                {
                    //-- 찾을번호
                    sqlstr += "    AND (A.TAX_MGMT_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "            OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "            OR INV_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "            OR TAX_DOC_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "            OR REF_NO =  '" + dr["N_VALUE"].ToString() + "') ";
                }
                else if (dr["SearchType"].ToString() == "S")
                {
                    //-- 담당자 일경우            
                    sqlstr += "    AND (UPPER(B2.MAIN_OFFC_EMAIL_ADDR) = UPPER('" + dr["EMAIL"].ToString() + "') OR UPPER(B2.SUB_OFFC_EMAIL_ADDR) = UPPER('" + dr["EMAIL"].ToString() + "')) ";

                    //문서종류 (세금)계산서 체크 일 경우 1=1
                    if (dr["ChkBill"].ToString() == "true")
                    {
                        sqlstr += " AND 1=1 ";
                    }
                    else
                    {
                        sqlstr += " AND 1=0 ";
                    }

                    //-- 작성일자, 발행일자
                    if (dr["SelectDate"].ToString() == "W")
                    {
                        sqlstr += "    AND A.WRITE_DT BETWEEN '" + dr["S_Date"].ToString() + "' AND '" + dr["E_Date"].ToString() + "' ";
                    }
                    else if (dr["SelectDate"].ToString() == "I")
                    {
                        sqlstr += "    AND SUBSTR(A.ISU_DATE, 1,8) BETWEEN '" + dr["S_Date"].ToString() + "' AND '" + dr["E_Date"].ToString() + "' ";
                    }

                    //-- 공급하는자 조건
                    if (dr["Supplier"].ToString() != "")
                    {
                        sqlstr += "    AND ELVISBILL.CRYPTO_AES256.DEC_AES(B1.TRADE_NM) LIKE '" + dr["Supplier"].ToString() + "%' ";
                    }

                    //-- 계산서번호
                    if (dr["BillNo"].ToString() != "")
                    {
                        sqlstr += "    AND A.TAX_MGMT_NO = '" + dr["BillNo"].ToString() + "' ";
                    }

                    //-- BL 번호
                    if (dr["BLNO"].ToString() != "")
                    {
                        sqlstr += "    AND A.BL_NO = '" + dr["BLNO"].ToString() + "' ";
                    }

                    //전송상태
                    if (dr["ChkState"].ToString() != "")
                    {
                        sqlstr += "    AND A.LAST_DOC_STATUS IN (" + dr["ChkState"].ToString() + ") ";
                    }
                }
                else if (dr["SearchType"].ToString() == "E")
                {
                    sqlstr += "     AND D.RCV_NO = '" + dr["N_VALUE"].ToString() + "' ";
                }
                else
                {
                    sqlstr += " AND 1=0 ";
                }
            }
            else if (dr["ContentType"].ToString() == "S")
            {
                //공급자 관련 쿼리.
            }
            else if (dr["ContentType"].ToString() == "A")
            {
                //관리자용 페이지 쿼리
                if (dr["SearchType"].ToString() == "N")
                {
                    sqlstr += "    AND (A.TAX_MGMT_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "            OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "            OR INV_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "            OR TAX_DOC_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "            OR REF_NO =  '" + dr["N_VALUE"].ToString() + "') ";
                }
                else
                {
                    sqlstr += " AND 1=0";
                }
            }
            else
            {
                sqlstr += " AND 1=0 ";
            }

            sqlstr += " UNION ALL ";

            sqlstr += " SELECT  ";
            sqlstr += "      '입금표'  As 입금표 ";
            sqlstr += "     , '문서접수' As 문서접수 ";
            sqlstr += "     , A.CRD_NO As 계산서번호 ";
            sqlstr += "     , '입금표' As 입금표 ";
            sqlstr += "     , A.WRITE_DT  As 작성일자 ";
            sqlstr += "     , TO_CHAR(TO_DATE(A.WRITE_DT),'YYYY-MM-DD')  AS 작성일자 ";
            sqlstr += "     , TO_CHAR(TO_DATE(SUBSTR (A.ISU_DATE, 1, 8)),'YYYY-MM-DD')  AS 발급일자 ";
            sqlstr += "     , A.BL_NO ";
            sqlstr += "     ,TO_CHAR (('0'), 'FM999,999,999,999,990') AS 공급가액 ";
            sqlstr += "     ,TO_CHAR (('0'), 'FM999,999,999,999,990') AS 세액 ";
            sqlstr += "     ,TO_CHAR ((A.TOT_AMT ), 'FM999,999,999,999,990') AS 대납비용포함 ";
            sqlstr += " FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";
            if (dr["SearchType"].ToString() == "E")
            {
                sqlstr += " INNER JOIN ELVISBILL.EVB_DOC_INFO D ON A.CRD_DOC_NO =D.DOC_NO AND D.DOC_TYPE ='CRD' ";
            }
            sqlstr += " WHERE 1=1  ";

            sqlstr += "     AND B.DMDER_BUSN_ID = '" + dr["CRN_NO"].ToString() + "'  ";                                          /* -- 사업자번호*/

            /* -- 문서종류 체크 여부 or 1=0*/
            if (dr["ContentType"].ToString() == "B")
            {
                // 번호기준(N) / 담당자(S) / 이메일(E)
                if (dr["SearchType"].ToString() == "N")
                {
                    //-- 찾을번호
                    sqlstr += "     AND (A.CRD_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "             OR A.CRD_DOC_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "             OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "') ";
                }
                else if (dr["SearchType"].ToString() == "S")
                {
                    //-- 담당자 일경우            
                    sqlstr += "     AND UPPER(B.DMDER_OFFC_EMAIL_ADDR) = UPPER('" + dr["EMAIL"].ToString() + "') ";

                    //문서종류 (세금)계산서 체크 일 경우 1=1
                    if (dr["ChkCredit"].ToString() == "true")
                    {
                        sqlstr += " AND 1=1 ";
                    }
                    else
                    {
                        sqlstr += " AND 1=0 ";
                    }

                    //-- 작성일자, 발행일자
                    if (dr["SelectDate"].ToString() == "W")
                    {
                        sqlstr += "    AND A.WRITE_DT BETWEEN '" + dr["S_Date"].ToString() + "' AND '" + dr["E_Date"].ToString() + "' ";
                    }
                    else if (dr["SelectDate"].ToString() == "I")
                    {
                        sqlstr += "    AND SUBSTR(A.ISU_DATE, 1,8) BETWEEN '" + dr["S_Date"].ToString() + "' AND '" + dr["E_Date"].ToString() + "' ";
                    }

                    //-- 공급하는자 조건
                    if (dr["Supplier"].ToString() != "")
                    {
                        sqlstr += "     AND B.DMDER_TRADE_NM LIKE '" + dr["Supplier"].ToString() + "%' ";
                    }

                    //-- 계산서번호
                    if (dr["BillNo"].ToString() != "")
                    {
                        sqlstr += "     AND A.CRD_NO = '" + dr["BillNo"].ToString() + "' ";
                    }

                    //-- BL 번호
                    if (dr["BLNO"].ToString() != "")
                    {
                        sqlstr += "    AND A.BL_NO = '" + dr["BLNO"].ToString() + "' ";
                    }
                }
                else if (dr["SearchType"].ToString() == "E")
                {
                    //E-Mail로 전송 되었을 떄
                    sqlstr += " AND D.RCV_NO = '" + dr["N_VALUE"].ToString() + "' ";
                }
                else
                {
                    sqlstr += " AND 1=0 ";
                }
            }
            else if (dr["ContentType"].ToString() == "S")
            {
                //공급자 관련 쿼리.
            }
            else if (dr["ContentType"].ToString() == "A")
            {
                //관리자용 페이지 쿼리
                if (dr["SearchType"].ToString() == "N")
                {
                    //-- 찾을번호
                    sqlstr += "     AND (A.CRD_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "             OR A.CRD_DOC_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "             OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "') ";
                }
                else
                {
                    sqlstr += " AND 1=0";
                }
            }
            else
            {
                sqlstr += " AND 1=0";
            }

            sqlstr += " ORDER BY 발급일자 DESC ";

            return sqlstr;
        }



        public string fnGetAllExcelData(DataRow dr){ // 기존 조회 쿼리의 전체 조회 쿼리
            sqlstr = "";

            sqlstr += "SELECT TOTAL.* ";
            sqlstr += " FROM ( ";

            #region 세금계산서
            sqlstr += "SELECT COM1.COM_NM AS 문서종류 ";
            sqlstr += "     , COM2.COM_NM AS 문서상태 ";
            sqlstr += "     , MST.TAX_MGMT_NO AS 계산서번호 ";
            sqlstr += "     , (CASE WHEN MST.ETAXBIL_CL_CD IN('01','02') THEN (CASE WHEN MST.ETAXBIL_KND_CD = '01' THEN '과세' ";
            sqlstr += "                                                             WHEN MST.ETAXBIL_KND_CD = '02' THEN '영세' ";
            sqlstr += "                                                             WHEN MST.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr += "                                                             ELSE'수입'   END) ";
            sqlstr += "             ELSE (CASE WHEN MST.ETAXBIL_KND_CD = '01' THEN '면세' ";
            sqlstr += "                        WHEN MST.ETAXBIL_KND_CD = '02' THEN '면세' ";
            sqlstr += "                        WHEN MST.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr += "                        ELSE '수입' END) END) AS 부가가치세 "; // 세금 종류
            sqlstr += "     , TO_CHAR(TO_DATE(MST.WRITE_DT),'YYYY-MM-DD')  AS 작성일자 ";
            sqlstr += "     , TO_CHAR(TO_DATE(SUBSTR (MST.ISU_DATE, 1, 8)),'YYYY-MM-DD')  AS 발급일자 ";
            if(dr["BUSN_TYPE"].ToString() == "01") //공급하는자 조건일 때
            {
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(RESUP.TRADE_NM) AS  공급받는자 "; //공급받는자 명
            }
            else{
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.TRADE_NM) AS  공급하는자 "; //공급하는자 명
            }

            sqlstr += "     , MST.BL_NO AS \"B/L NO\" ";

            sqlstr += "     ,TO_CHAR ((TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (MST.SUP_SM_AMT))), 'FM999,999,999,999,990') AS 공급가액 ";
            sqlstr += "     ,TO_CHAR ((TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (MST.VAT_SM_AMT))), 'FM999,999,999,999,990') AS 세액   ";
            sqlstr += "     ,TO_CHAR ((TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (MST.TOT_AMT))) + MST.WF_AMT, 'FM999,999,999,999,990')  AS 대납비용포함 ";

            #region 테이블
            sqlstr += "FROM ELVISBILL.EVB_TAX_MST MST ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC SUP "; //공급자
            sqlstr += "         ON MST.TAX_DOC_NO = SUP.TAX_DOC_NO ";
            sqlstr += "         AND SUP.BUSN_KND_CD = '01' ";

            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC RESUP "; //받는자
            sqlstr += "         ON MST.TAX_DOC_NO = RESUP.TAX_DOC_NO ";
            sqlstr += "         AND RESUP.BUSN_KND_CD = '02' ";

            sqlstr += " INNER JOIN ELVISBILL.EVB_COM_CD COM1 "; //분류코드
            sqlstr += "        ON MST.ETAXBIL_CL_CD = COM1.COM_CD ";
            sqlstr += "        AND COM1.GRP_CD = 'ETAXBIL_CL_CD' ";

            sqlstr += " INNER JOIN ELVISBILL.EVB_COM_CD COM2 "; //응답코드
            sqlstr += "        ON MST.LAST_DOC_STATUS = COM2.COM_CD ";
            sqlstr += "        AND COM2.GRP_CD = 'ETAX_RCPT_CD' ";

            #endregion

            #region 조건절
            //세금계산서 체크 유무
            if (dr["ChkBill"].ToString() == "true")
            {
                sqlstr += " WHERE 1=1 ";
            }
            else
            {
                sqlstr += " WHERE 1=0 ";
            }

            //사용자 정보 매칭
            if (dr["BUSN_TYPE"].ToString() == "01") //본인이 공급하는자 일경우
            {
                sqlstr += " AND   ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.BUSN_ID) = '" + dr["BUSN_NO"].ToString() + "' ";
            }
            else //본인이 공급받는자 일경우
            {
                sqlstr += " AND   ELVISBILL.CRYPTO_AES256.DEC_AES(RESUP.BUSN_ID) = '" + dr["BUSN_NO"].ToString() + "' ";
            }

            if (dr["SAECH_DT_TYPE"].ToString() != null && dr["SAECH_DT_TYPE"].ToString() == "W") //일자 조건
            {
                sqlstr += " AND WRITE_DT BETWEEN '" + dr["S_DATE"].ToString() + "' AND '" + dr["E_DATE"].ToString() + "' "; //작성일자 기준
            }
            else
            {
                sqlstr += " AND ISU_DATE BETWEEN '" + dr["S_DATE"].ToString() + "' AND '" + dr["E_DATE"].ToString() + "' "; //발급일자 기준
            }

            if (dr.Table.Columns.Contains("BL_NO")) //비엘번호 있을때
            {
                if (dr["BL_NO"].ToString() != null)
                    sqlstr += "     AND MST.BL_NO = '" + dr["BL_NO"].ToString() + "' ";
            }

            if (dr.Table.Columns.Contains("TAX_MGMT_NO")) //계산서 번호
            {
                if (dr["TAX_MGMT_NO"].ToString() != null)
                {
                    sqlstr += "         AND MST.TAX_MGMT_NO = '" + dr["TAX_MGMT_NO"].ToString() + "' ";
                }
            }

            if (dr.Table.Columns.Contains("TRADE_NM")) //공급하는자|공급받는자
            {
                if (dr["BUSN_TYPE"].ToString() == "01" && dr["TRADE_NM"].ToString() != "") // 공급하는자 선택시 (공급받는자 조건으로 검색)
                {
                    sqlstr += "         AND ELVISBILL.CRYPTO_AES256.DEC_AES(RESUP.TRADE_NM) LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
                else if (dr["BUSN_TYPE"].ToString() == "02" && dr["TRADE_NM"].ToString() != "")// 공급받는자 선택시 (공급하는자 조건으로 검색)
                {
                    sqlstr += "         AND ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.TRADE_NM) LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
            }

            if (dr.Table.Columns.Contains("ChkState")) // 전송상태
            {
                if (dr["ChkState"].ToString() != "A") //전체 이외 선택의 경우 
                {
                    sqlstr += "    AND MST.LAST_DOC_STATUS IN (" + dr["ChkState"].ToString() + ") ";
                }

            }

            if (dr["ChkVat"].ToString() != "A") // 세금구분
            {
                string[] VatList = dr["ChkVat"].ToString().Split(',');

                sqlstr += "AND ( ";
                //과세
                if (dr["ChkVat"].ToString().Contains("01"))
                {
                    sqlstr += "( ETAXBIL_CL_CD IN('01','02') "; //구분
                    sqlstr += " AND ETAXBIL_KND_CD = '01' ) ";
                }
                //영세
                if (dr["ChkVat"].ToString().Contains("02"))
                {
                    if (VatList[0].ToString() != "'02'")
                    {
                        sqlstr += " OR ";
                    }

                    sqlstr += " ( ETAXBIL_CL_CD IN('01','02') ";//구분
                    sqlstr += " AND ETAXBIL_KND_CD = '02' )";
                }
                //면세
                if (dr["ChkVat"].ToString().Contains("03"))
                {
                    if (VatList[0].ToString() != "'03'")
                    {
                        sqlstr += " OR ";
                    }
                    sqlstr += "  (ETAXBIL_CL_CD NOT IN('01','02') ";//구분
                    sqlstr += " AND (ETAXBIL_KND_CD = '01' OR ETAXBIL_KND_CD = '02' ) ) ";
                }

                sqlstr += " ) ";
            }

            #endregion

            #endregion
            sqlstr += " UNION ALL ";

            #region 입금표
            sqlstr += "SELECT ";
            sqlstr += "      '입금표' AS 문서종류 ";
            sqlstr += "     , '문서접수' AS 문서상태 ";
            sqlstr += "     , A.CRD_NO AS 계산서번호 ";
            sqlstr += "     , '입금표' AS 부가가치세 ";
            sqlstr += "     , TO_CHAR(TO_DATE(A.WRITE_DT),'YYYY-MM-DD')  AS 작성일자 ";
            sqlstr += "     , TO_CHAR(TO_DATE(SUBSTR (A.ISU_DATE, 1, 8)),'YYYY-MM-DD')  AS 발급일자 ";
            if (dr["BUSN_TYPE"].ToString() == "01") //공급하는자 조건일 때
            {
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(B.SUPLER_TRADE_NM) AS  공급받는자 "; //공급받는자 명
            }
            else
            {
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(B.DMDER_TRADE_NM) AS  공급하는자 "; //공급하는자 명
            }

            sqlstr += "     , A.BL_NO AS \"B/L NO\"";

            sqlstr += "     ,TO_CHAR (('0'), 'FM999,999,999,999,990') AS 공급가액 ";
            sqlstr += "     ,TO_CHAR (('0'), 'FM999,999,999,999,990') AS 세액   ";
            sqlstr += "     ,TO_CHAR (A.TOT_AMT, 'FM999,999,999,999,990')  AS 대납비용포함 ";


            #region 테이블
            sqlstr += "FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";

            #endregion

            #region 조건절
            //입금표 체크 유무
            if (dr["ChkCredit"].ToString() == "true")
            {
                sqlstr += " WHERE 1=1 ";
            }
            else
            {
                sqlstr += " WHERE 1=0 ";
            }
            //사용자 정보 매칭
            if (dr["BUSN_TYPE"].ToString() == "01") //본인이 공급하는자 일경우
            {
                sqlstr += " AND   ELVISBILL.CRYPTO_AES256.DEC_AES(B.DMDER_BUSN_ID) = '" + dr["BUSN_NO"].ToString() + "' ";
            }
            else //본인이 공급받는자 일경우
            {
                sqlstr += " AND   ELVISBILL.CRYPTO_AES256.DEC_AES(B.SUPLER_BUSN_ID) = '" + dr["BUSN_NO"].ToString() + "' ";
            }


            if (dr["SAECH_DT_TYPE"].ToString() != null && dr["SAECH_DT_TYPE"].ToString() == "W") //일자 조건
            {
                sqlstr += " AND WRITE_DT BETWEEN '" + dr["S_DATE"].ToString() + "' AND '" + dr["E_DATE"].ToString() + "' "; //작성일자 기준
            }
            else
            {
                sqlstr += " AND ISU_DATE BETWEEN '" + dr["S_DATE"].ToString() + "' AND '" + dr["E_DATE"].ToString() + "' "; //발급일자 기준
            }


            if (dr.Table.Columns.Contains("BL_NO")) //비엘번호 있을때
            {
                if (dr["BL_NO"].ToString() != null)
                    sqlstr += "     AND A.BL_NO = '" + dr["BL_NO"].ToString() + "' ";
            }

            if (dr.Table.Columns.Contains("TAX_MGMT_NO")) //계산서 번호
            {
                if (dr["TAX_MGMT_NO"].ToString() != null)
                {
                    sqlstr += "         AND A.CRD_NO = '" + dr["TAX_MGMT_NO"].ToString() + "' ";
                }
            }

            if (dr.Table.Columns.Contains("TRADE_NM")) //공급하는자|공급받는자
            {
                if (dr["BUSN_TYPE"].ToString() == "01" && dr["TRADE_NM"].ToString() != "") // 공급하는자 선택시 (공급받는자 조건으로 검색)
                {
                    sqlstr += "         AND ELVISBILL.CRYPTO_AES256.DEC_AES(B.SUPLER_TRADE_NM) LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
                else if (dr["BUSN_TYPE"].ToString() == "02" && dr["TRADE_NM"].ToString() != "")// 공급받는자 선택시 (공급하는자 조건으로 검색)
                {
                    sqlstr += "         AND ELVISBILL.CRYPTO_AES256.DEC_AES(B.DMDER_TRADE_NM) LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
            }

            #endregion

            #endregion

            sqlstr += " ) TOTAL";
            sqlstr += " WHERE 1=1 ";
            if (dr["SAECH_DT_TYPE"].ToString() == "W") //조회와 동일한 정렬 사용 하기 위해 한번 묶어서 정렬
            {
                sqlstr += " ORDER BY 작성일자 DESC";
            }
            else
            {
                sqlstr += " ORDER BY 발급일자 DESC";
            }
            


            return sqlstr;
        }
    }
}
