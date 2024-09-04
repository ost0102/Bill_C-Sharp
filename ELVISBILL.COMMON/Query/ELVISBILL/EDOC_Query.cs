using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace ELVISBILL.COMMON.Query.ELVISBILL
{
    public class EDOC_Query
    {
        string sqlstr;

        /// <summary>
        /// Edoc 리스트 검색 데이터 가져오는 쿼리
        /// </summary>
        /// <param name="dr">파라미터 데이터</param>
        /// <returns></returns>
        public string fnGetEdocList(DataRow dr)
        {
            sqlstr = "";
            sqlstr += " SELECT * ";
            sqlstr += "   FROM (SELECT ROWNUM AS RNUM, ";
            sqlstr += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE, ";
            sqlstr += "                COUNT (*) OVER () AS TOTCNT, ";
            sqlstr += "                TOTAL.* ";
            sqlstr += "           FROM ( ";
            /* 번호기준 */
            sqlstr +=" SELECT 'T' As DOC_TYPE_CD ";
            sqlstr +="     , C1.COM_NM As DOC_TYPE_NM ";
            sqlstr += "     ,A.LAST_DOC_STATUS ";
            sqlstr += "     ,C2.COM_NM AS LAST_DOC_STATUS_NM ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) != 'N' THEN A.LAST_DOC_STATUS";
            sqlstr += "            ELSE (SELECT RCPT_CD  FROM ELVISBILL.EVB_TAX_STAS WHERE TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                          AND INS_YMD || INS_HM = (SELECT MAX(INS_YMD || INS_HM) FROM ELVISBILL.EVB_TAX_STAS";
            sqlstr += "                                                     WHERE TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                                                     AND RCPT_CD IN ('SO','BS','BR','LF'))";
            sqlstr += "                          AND RCPT_CD IN ('SO','BS','BR','LF')) END) As LAST_DOC_STATUS1 ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) != 'N' THEN C2.COM_NM";
            sqlstr += "            ELSE (SELECT CC.COM_NM  FROM ELVISBILL.EVB_TAX_STAS AC ";
            sqlstr += "                   LEFT JOIN ELVISBILL.EVB_COM_CD CC ON AC.RCPT_CD = CC.COM_CD AND CC.GRP_CD = 'ETAX_RCPT_CD'";
            sqlstr += "                  WHERE AC.TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                  AND AC.INS_YMD || AC.INS_HM = (SELECT MAX(INS_YMD || INS_HM) FROM ELVISBILL.EVB_TAX_STAS";
            sqlstr += "                                                     WHERE TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                                                     AND RCPT_CD IN ('SO','BS','BR','LF'))";
            sqlstr += "                          AND RCPT_CD IN ('SO','BS','BR','LF')) END) As LAST_DOC_STATUS_NM1 ";
            //sqlstr +="     , C2.COM_NM As LAST_DOC_STATUS_NM ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) = 'N' THEN A.LAST_DOC_STATUS ELSE '' END) As LAST_DOC_STATUS2 ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) = 'N' THEN C2.COM_NM ELSE '' END) As LAST_DOC_STATUS_NM2 ";
            
            sqlstr +="     , A.TAX_MGMT_NO ";
            sqlstr +="     , A.ETAXBIL_CL_CD ";
            sqlstr +="     , A.ETAXBIL_KND_CD "; 
            sqlstr +="     , (CASE WHEN A.ETAXBIL_CL_CD IN ('01', '02') THEN  "; 
            sqlstr +="                     (CASE WHEN A.ETAXBIL_KND_CD = '01' THEN '과세' ";
            sqlstr +="                               WHEN A.ETAXBIL_KND_CD = '02' THEN '영세' "; 
            sqlstr +="                                WHEN A.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr +="                                ELSE '수입' END) ";
            sqlstr +="                ELSE ";
            sqlstr +="                     (CASE WHEN A.ETAXBIL_KND_CD = '01' THEN '계산서' ";
            sqlstr +="                               WHEN A.ETAXBIL_KND_CD = '02' THEN '계산서' ";
            sqlstr +="                                WHEN A.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr +="                                ELSE '수입' END) ";
            sqlstr +="                END)  As DOC_DIV ";
            sqlstr +="     , A.WRITE_DT       ";
            sqlstr +="     , SUBSTR(A.ISU_DATE, 1,8) As ISU_DATE ";
            sqlstr +="     , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.TRADE_NM) As DMDER_TRADE_NM ";
            sqlstr +="     , A.BL_NO ";
            sqlstr +="     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.SUP_SM_AMT)) AS SUP_SM_AMT ";
            sqlstr +="     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.VAT_SM_AMT)) AS VAT_SM_AMT ";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) + A.WF_AMT AS TOT_AMT ";
            sqlstr +="     , 1 AS DISP_SEQ ";
            sqlstr += "    , A.TAX_DOC_NO  ";
            sqlstr += "     , A.INS_YMD || A.INS_HM AS INS_DATE     ";
            sqlstr += "     , A.WF_AMT     "; //twkim 추가 20210308
            sqlstr += "     , (CASE WHEN A.ETAXBIL_TP_CD = '01' THEN '영수' ELSE '청구' END) AS ETAXBIL_TP_NM "; //twkim 추가 20210507
            sqlstr +=" FROM ELVISBILL.EVB_TAX_MST A ";
            sqlstr +=" INNER JOIN ELVISBILL.EVB_TAX_OFFC B1 ON A.TAX_DOC_NO = B1.TAX_DOC_NO AND B1.BUSN_KND_CD = '01' ";
            sqlstr +=" INNER JOIN ELVISBILL.EVB_TAX_OFFC B2 ON A.TAX_DOC_NO = B2.TAX_DOC_NO AND B2.BUSN_KND_CD = '02' ";
            sqlstr +=" LEFT JOIN ELVISBILL.EVB_COM_CD C1 ON A.ETAXBIL_CL_CD = C1.COM_CD AND C1.GRP_CD = 'ETAXBIL_CL_CD' ";
            sqlstr +=" LEFT JOIN ELVISBILL.EVB_COM_CD C2 ON A.LAST_DOC_STATUS = C2.COM_CD AND C2.GRP_CD = 'ETAX_RCPT_CD' ";
            if (dr["SearchType"].ToString() == "E")
            {
                sqlstr += " INNER JOIN ELVISBILL.EVB_DOC_INFO D ON A.TAX_DOC_NO =D.DOC_NO AND D.DOC_TYPE ='TAX' ";
            }

            sqlstr +="WHERE 1=1";

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


            sqlstr +=" UNION ALL ";

            sqlstr +=" SELECT 'R' As DOC_TYPE_CD ";
            sqlstr +="     , '입금표'  As DOC_TYPE_NM ";
            sqlstr +="     , 'SO' As LAST_DOC_STATUS ";
            sqlstr +="     , '문서접수' As LAST_DOC_STATUS_NM ";
            sqlstr += "     , 'SO' As LAST_DOC_STATUS1 ";
            sqlstr += "     , '문서접수' As LAST_DOC_STATUS_NM1 ";
            sqlstr += "     , '' As LAST_DOC_STATUS2 ";
            sqlstr += "     , '' As LAST_DOC_STATUS_NM2 ";
            sqlstr +="     , A.CRD_NO As TAX_MGMT_NO ";
            sqlstr +="     , null As ETAXBIL_CL_CD ";
            sqlstr += "    , A.DOC_DIV As ETAXBILL_KND_CD ";
            sqlstr += "     ,  (CASE WHEN A.DOC_DIV = 'C1' THEN '일반입금표' ELSE '대리점입금표' END) As DOC_DIV ";
            sqlstr +="     , A.WRITE_DT ";
            sqlstr +="     , SUBSTR(A.ISU_DATE, 1,8) As ISU_DATE ";
            sqlstr +="     , B.DMDER_TRADE_NM ";
            sqlstr +="     , A.BL_NO ";
            sqlstr +="     , 0 As SUP_SM_AMT ";
            sqlstr +="     , 0 As VAT_SM_AMT ";
            sqlstr +="     , A.TOT_AMT As TOT_AMT ";
            sqlstr +="     , 2 AS DISP_SEQ ";
            sqlstr += "    , A.CRD_DOC_NO AS TAX_DOC_NO  ";
            sqlstr += "     , A.INS_YMD || A.INS_HM AS INS_DATE     ";
            sqlstr += "     , 0 AS WF_AMT "; //twkim 추가 20210308
            sqlstr += "     , '' AS ETAXBIL_TP_NM "; //twkim 추가 20210507
            sqlstr +=" FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr +=" INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";
            if (dr["SearchType"].ToString() == "E")
            {
                sqlstr += " INNER JOIN ELVISBILL.EVB_DOC_INFO D ON A.CRD_DOC_NO =D.DOC_NO AND D.DOC_TYPE ='CRD' ";
            }
            sqlstr +=" WHERE 1=1  ";

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

            sqlstr += " ORDER BY INS_DATE DESC, DISP_SEQ ";

            sqlstr += " ) ";
            sqlstr += " TOTAL) ";
            sqlstr += "WHERE PAGE = '"+dr["PAGE"].ToString()+"'";

            return sqlstr;
        }

        /// <summary>
        /// Edoc 리스트 검색 데이터 가져오는 쿼리
        /// </summary>
        /// <param name="dr">파라미터 데이터</param>
        /// <returns></returns>
        public string fnGetEdocList_Refresh(DataRow dr)
        {
            sqlstr = "";
            sqlstr += " SELECT * ";
            sqlstr += "   FROM (SELECT ROWNUM AS RNUM, ";
            sqlstr += "                FLOOR ( (ROWNUM - 1) / " + dr["TOTAL"].ToString() + " + 1) AS PAGE, ";
            sqlstr += "                COUNT (*) OVER () AS TOTCNT, ";
            sqlstr += "                TOTAL.* ";
            sqlstr += "           FROM ( ";
            /* 번호기준 */
            sqlstr += " SELECT 'T' As DOC_TYPE_CD ";
            sqlstr += "     , C1.COM_NM As DOC_TYPE_NM ";
            sqlstr += "     ,A.LAST_DOC_STATUS ";
            sqlstr += "     ,C2.COM_NM AS LAST_DOC_STATUS_NM ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) != 'N' THEN A.LAST_DOC_STATUS";
            sqlstr += "            ELSE (SELECT RCPT_CD  FROM ELVISBILL.EVB_TAX_STAS WHERE TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                          AND INS_YMD || INS_HM = (SELECT MAX(INS_YMD || INS_HM) FROM ELVISBILL.EVB_TAX_STAS";
            sqlstr += "                                                     WHERE TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                                                     AND RCPT_CD IN ('SO','BS','BR','LF'))";
            sqlstr += "                          AND RCPT_CD IN ('SO','BS','BR','LF')) END) As LAST_DOC_STATUS1 ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) != 'N' THEN C2.COM_NM";
            sqlstr += "            ELSE (SELECT CC.COM_NM  FROM ELVISBILL.EVB_TAX_STAS AC ";
            sqlstr += "                   LEFT JOIN ELVISBILL.EVB_COM_CD CC ON AC.RCPT_CD = CC.COM_CD AND CC.GRP_CD = 'ETAX_RCPT_CD'";
            sqlstr += "                  WHERE AC.TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                  AND AC.INS_YMD || AC.INS_HM = (SELECT MAX(INS_YMD || INS_HM) FROM ELVISBILL.EVB_TAX_STAS";
            sqlstr += "                                                     WHERE TAX_DOC_NO = A.TAX_DOC_NO";
            sqlstr += "                                                     AND RCPT_CD IN ('SO','BS','BR','LF'))";
            sqlstr += "                          AND RCPT_CD IN ('SO','BS','BR','LF')) END) As LAST_DOC_STATUS_NM1 ";
            //sqlstr +="     , C2.COM_NM As LAST_DOC_STATUS_NM ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) = 'N' THEN A.LAST_DOC_STATUS ELSE '' END) As LAST_DOC_STATUS2 ";
            sqlstr += "    , (CASE WHEN SUBSTR(A.LAST_DOC_STATUS,1,1) = 'N' THEN C2.COM_NM ELSE '' END) As LAST_DOC_STATUS_NM2 ";
            sqlstr += "     , A.TAX_MGMT_NO ";
            sqlstr += "     , A.ETAXBIL_CL_CD ";
            sqlstr += "     , A.ETAXBIL_KND_CD ";
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
            sqlstr += "                END)  As DOC_DIV ";
            sqlstr += "     , A.WRITE_DT       ";
            sqlstr += "     , SUBSTR(A.ISU_DATE, 1,8) As ISU_DATE ";
            sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.TRADE_NM) As DMDER_TRADE_NM ";
            sqlstr += "     , A.BL_NO ";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.SUP_SM_AMT)) AS SUP_SM_AMT ";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.VAT_SM_AMT)) AS VAT_SM_AMT ";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) + A.WF_AMT AS TOT_AMT ";
            sqlstr += "     , 1 AS DISP_SEQ ";
            sqlstr += "    , A.TAX_DOC_NO  ";
            sqlstr += "     , A.INS_YMD || A.INS_HM AS INS_DATE     ";
            sqlstr += "     , A.WF_AMT     "; //twkim 추가 20210308
            sqlstr += "     , (CASE WHEN A.ETAXBIL_TP_CD = '01' THEN '영수' ELSE '청구' END) AS ETAXBIL_TP_NM "; //twkim 추가 20210507
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
                    sqlstr += "    AND (B2.MAIN_OFFC_EMAIL_ADDR = '" + dr["EMAIL"].ToString() + "' OR B2.SUB_OFFC_EMAIL_ADDR = '" + dr["EMAIL"].ToString() + "') ";

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
                if (dr["SearchType"].ToString() == "N")
                {
                    //-- 찾을번호
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
                sqlstr += " AND 1=0";
            }

            sqlstr += " UNION ALL ";

            sqlstr += " SELECT 'R' As DOC_TYPE_CD ";
            sqlstr += "     , '입금표'  As DOC_TYPE_NM ";
            sqlstr += "     , 'SO' As LAST_DOC_STATUS ";
            sqlstr += "     , '문서접수' As LAST_DOC_STATUS_NM ";
            sqlstr += "     , 'SO' As LAST_DOC_STATUS1 ";
            sqlstr += "     , '문서접수' As LAST_DOC_STATUS_NM1 ";
            sqlstr += "     , '' As LAST_DOC_STATUS2 ";
            sqlstr += "     , '' As LAST_DOC_STATUS_NM2 ";
            sqlstr += "     , A.CRD_NO As TAX_MGMT_NO ";
            sqlstr += "     , null As ETAXBIL_CL_CD ";
            sqlstr += "     , A.DOC_DIV As ETAXBILL_KND_CD ";
            sqlstr += "     ,  (CASE WHEN A.DOC_DIV = 'C1' THEN '일반입금표' ELSE '대리점입금표' END) As DOC_DIV ";
            sqlstr += "     , A.WRITE_DT ";
            sqlstr += "     , SUBSTR(A.ISU_DATE, 1,8) As ISU_DATE ";
            sqlstr += "     , B.DMDER_TRADE_NM ";
            sqlstr += "     , A.BL_NO ";
            sqlstr += "     , 0 As SUP_SM_AMT ";
            sqlstr += "     , 0 As VAT_SM_AMT ";
            sqlstr += "     , A.TOT_AMT As TOT_AMT ";
            sqlstr += "     , 2 AS DISP_SEQ ";
            sqlstr += "    , A.CRD_DOC_NO AS TAX_DOC_NO  ";
            sqlstr += "     , A.INS_YMD || A.INS_HM AS INS_DATE     ";
            sqlstr += "     , 0 AS WF_AMT "; //twkim 추가 20210308
            sqlstr += "     , '' AS ETAXBIL_TP_NM "; //twkim 추가 20210507
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
                    sqlstr += "     AND (A.CRD_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "             OR A.CRD_DOC_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "             OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "') ";
                }
                else if (dr["SearchType"].ToString() == "S")
                {
                    //-- 담당자 일경우            
                    sqlstr += "     AND B.DMDER_OFFC_EMAIL_ADDR = '" + dr["EMAIL"].ToString() + "' ";

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
                    sqlstr += " AND D.RCV_NO = '" + dr["N_VALUE"].ToString() + "' ";
                }
            }
            else if (dr["ContentType"].ToString() == "S")
            {
                //공급자 관련 쿼리.
            }
            else if (dr["ContentType"].ToString() == "A")
            {
                if (dr["SearchType"].ToString() == "N")
                {
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

            sqlstr += " ORDER BY  INS_DATE DESC, DISP_SEQ ";

            sqlstr += " ) ";
            sqlstr += " TOTAL) ";
            sqlstr += "WHERE PAGE = '" + dr["PAGE"].ToString() + "'";

            return sqlstr;
        }

        /// <summary>
        /// Edoc 리스트 Count 갯수 가져오는 쿼리
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetEdocList_Total(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT 'T' As DOC_TYPE_CD ";
            sqlstr += "       ,NVL(SUM (TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.SUP_SM_AMT))),'0') AS SUP_SM_AMT ";
            sqlstr += "       ,NVL(SUM (TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.VAT_SM_AMT))),'0') AS VAT_SM_AMT ";
            sqlstr += "       ,NVL (SUM (A.WF_AMT),'0') AS TOT_WF_AMT ";
            //sqlstr += "       ,NVL(SUM (TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.TOT_AMT))),'0') AS TOT_AMT ";
            sqlstr += " ,NVL (SUM (TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.SUP_SM_AMT))), ";
            sqlstr += "             '0') ";
            sqlstr += "        + NVL ( ";
            sqlstr += "             SUM (TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (A.VAT_SM_AMT))), ";
            sqlstr += "             '0') ";
            sqlstr += "        + NVL (SUM (A.WF_AMT), '0') ";
            sqlstr += "           AS TOT_AMT ";
            sqlstr += "     , 1 AS DISP_SEQ ";
            sqlstr += " FROM ELVISBILL.EVB_TAX_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B1 ON A.TAX_DOC_NO = B1.TAX_DOC_NO AND B1.BUSN_KND_CD = '01' ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B2 ON A.TAX_DOC_NO = B2.TAX_DOC_NO AND B2.BUSN_KND_CD = '02' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C1 ON A.ETAXBIL_CL_CD = C1.COM_CD AND C1.GRP_CD = 'ETAXBIL_CL_CD' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C2 ON A.LAST_DOC_STATUS = C2.COM_CD AND C2.GRP_CD = 'ETAX_RCPT_CD' ";
            if (dr["SearchType"].ToString() == "E")
            {
                sqlstr += " INNER JOIN ELVISBILL.EVB_DOC_INFO D ON A.TAX_DOC_NO =D.DOC_NO AND D.DOC_TYPE ='TAX' ";
            }
            sqlstr += "WHERE 1=1 ";

            sqlstr += "    AND ELVISBILL.CRYPTO_AES256.DEC_AES(A.DMDER_BUSN_ID) = '" + dr["CRN_NO"].ToString() + "' ";             /*-- 사업자번호*/

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
                    sqlstr += "    AND (B2.MAIN_OFFC_EMAIL_ADDR = '" + dr["EMAIL"].ToString() + "' OR B2.SUB_OFFC_EMAIL_ADDR = '" + dr["EMAIL"].ToString() + "') ";

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
                    //E-Mail로 들어왔을 떄 Query                    
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
                if (dr["SearchType"].ToString() == "N")
                {
                    //-- 찾을번호
                    sqlstr += "    AND (A.TAX_MGMT_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "            OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "            OR INV_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "            OR TAX_DOC_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "            OR REF_NO =  '" + dr["N_VALUE"].ToString() + "') ";
                }
                else
                {
                    sqlstr += " AND 1=0 ";
                }
            }
            else
            {
                sqlstr += " AND 1=0 ";
            }

            sqlstr += " UNION ALL ";

            sqlstr += " SELECT 'R' As DOC_TYPE_CD ";
            sqlstr += "     , 0 As SUP_SM_AMT ";
            sqlstr += "     , 0 As VAT_SM_AMT ";
            sqlstr += "     , 0 AS TOT_WF_AMT ";
            sqlstr += "       , NVL(SUM (A.TOT_AMT),'0') AS TOT_AMT ";
            sqlstr += "     , 2 AS DISP_SEQ ";
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
                    sqlstr += "     AND B.DMDER_OFFC_EMAIL_ADDR = '" + dr["EMAIL"].ToString() + "' ";

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
                    //E-Mail로 들어왔을 떄 쿼리
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
                //관리자 용 페이지 쿼리
                if (dr["SearchType"].ToString() == "N")
                {
                    //-- 찾을번호
                    sqlstr += "     AND (A.CRD_NO = '" + dr["N_VALUE"].ToString() + "'  ";
                    sqlstr += "             OR A.CRD_DOC_NO = '" + dr["N_VALUE"].ToString() + "' ";
                    sqlstr += "             OR A.BL_NO = '" + dr["N_VALUE"].ToString() + "') ";
                }
                else
                {
                    sqlstr += " AND 1=0 ";
                }
            }
            else 
            {
                sqlstr += " AND 1=0 ";
            }

            return sqlstr;
        }


        /// <summary>
        /// 레이어팝업 - 세금계산서 상세내역 데이터
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetTaxData(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT (CASE WHEN A.ETAXBIL_CL_CD IN ('01', '03') THEN '01' ";
            sqlstr += "                      WHEN A.ETAXBIL_CL_CD IN ('02', '04') THEN '02' ";
            sqlstr += "                      ELSE '03' END) As TAX_DOC_DIV  ";
            sqlstr += "         , (CASE WHEN A.ETAXBIL_CL_CD IN ('01', '02') AND A.ETAXBIL_KND_CD = '01'  THEN '01' ";
            sqlstr += "                      WHEN A.ETAXBIL_CL_CD IN ('01', '02') AND A.ETAXBIL_KND_CD = '02'  THEN '02' ";
            sqlstr += "                      ELSE '03' END) As TAX_CLASS  ";
            sqlstr += "         , A.TAX_DOC_NO ";
            sqlstr += "         , A.ETAX_APPV_NO  ";
            sqlstr += "         , A.TAX_MGMT_NO ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.BUSN_ID) As SUP_BUSN_ID ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.CHIEF_NM) As SUP_CHIEF_NM  ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.TRADE_NM) As SUP_TRADE_NM ";
            sqlstr += "         , B1.ADDR As SUP_ADDR  ";
            sqlstr += "         , B1.BUSNSECT_NM As SUP_BUSNSECT_NM ";
            sqlstr += "         , B1.DETAIL_NM As SUP_DETAIL_NM  ";
            sqlstr += "         , B1.MAIN_OFFC_NM As SUP_MAIN_OFFC_NM  ";
            sqlstr += "         , B1.MAIN_OFFC_DEPT_NM As SUP_MAIN_OFFC_DEPT_NM ";
            sqlstr += "         , B1.MAIN_OFFC_TEL_NO As SUP_MAIN_OFFC_TEL_NO ";
            sqlstr += "         , B1.MAIN_OFFC_MTEL_NO As SUP_MAIN_OFFC_MTEL_NO ";
            sqlstr += "         , B1.MAIN_OFFC_EMAIL_ADDR As SUP_MAIN_OFFC_EMAIL_ADDR ";
            sqlstr += "         , B1.SUB_BD_NO As SUP_SUB_BD_NO ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B2.BUSN_ID) As DMD_BUSN_ID ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B2.CHIEF_NM) As DMD_CHIEF_NM ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B2.TRADE_NM) As DMD_TRADE_NM ";
            sqlstr += "         , B2.ADDR As DMD_ADDR ";
            sqlstr += "         , B2.BUSNSECT_NM As DMD_BUSNSECT_NM ";
            sqlstr += "         , B2.DETAIL_NM As DMD_DETAIL_NM ";
            sqlstr += "         , B2.MAIN_OFFC_NM As DMD_MAIN_OFFC_NM  ";
            sqlstr += "         , B2.MAIN_OFFC_DEPT_NM As DMD_MAIN_OFFC_DEPT_NM ";
            sqlstr += "         , B2.MAIN_OFFC_TEL_NO As DMD_MAIN_OFFC_TEL_NO ";
            sqlstr += "         , B2.MAIN_OFFC_MTEL_NO As DMD_MAIN_OFFC_MTEL_NO ";
            sqlstr += "         , B2.MAIN_OFFC_EMAIL_ADDR As DMD_MAIN_OFFC_EMAIL_ADDR ";
            sqlstr += "         , B2.SUB_BD_NO As DMD_SUB_BD_NO ";
            sqlstr += "         , A.WRITE_DT ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.SUP_SM_AMT)) AS SUP_SM_AMT ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.VAT_SM_AMT)) AS VAT_SM_AMT ";
            sqlstr += "         , A.BL_NO  ";
            sqlstr += "         , A.WF_AMT  ";
            sqlstr += "         , A.WF_AMT + TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) AS TOT_AMT ";
            sqlstr += "         , A.ETAXBIL_NOTE ";
            sqlstr += "         , A.LAST_DOC_STATUS ";
            sqlstr += "         , C2.COM_NM As LAST_DOC_STATUS_NM  ";
            sqlstr += "         , (CASE WHEN A.LAST_DOC_STATUS = 'BR' THEN ";
            sqlstr += "                     (SELECT MAX(RCPT_RSPN)  ";
            sqlstr += "                      FROM ELVISBILL.EVB_TAX_STAS  ";
            sqlstr += "                      WHERE TAX_DOC_NO = A.TAX_DOC_NO  ";
            sqlstr += "                      AND RCPT_CD = A.LAST_DOC_STATUS)  ";
            sqlstr += "                     ELSE '' END) REFUND_REASON  ";
            sqlstr += "         , (SELECT COUNT(*) FROM ELVISBILL.EVB_TAX_DTL WHERE TAX_DOC_NO = A.TAX_DOC_NO) As DETAIL_CNT  ";
            sqlstr += "         , XML_PATH  ";
            sqlstr += " FROM  ELVISBILL.EVB_TAX_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B1 ON A.TAX_DOC_NO = B1.TAX_DOC_NO AND B1.BUSN_KND_CD = '01' ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B2 ON A.TAX_DOC_NO = B2.TAX_DOC_NO AND B2.BUSN_KND_CD = '02' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C2 ON A.LAST_DOC_STATUS = C2.COM_CD AND C2.GRP_CD = 'ETAX_RCPT_CD' ";
            sqlstr += " WHERE  A.TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 레이어팝업 - 세금계산서 내역 리스트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetTaxList(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT SEQ_NO  ";
            sqlstr += "     , PURCHS_DT ";
            sqlstr += "     , THNG_NM ";
            sqlstr += "     , STNDRD_NM ";
            //sqlstr += "     , QTY ";
            //sqlstr += "     , UNT_PRC ";
            sqlstr += "     , CASE WHEN STNDRD_NM = 'KRW' THEN NULL ELSE QTY END AS \"QTY\" ";
            sqlstr += "     , CASE WHEN STNDRD_NM = 'KRW' THEN NULL ELSE UNT_PRC END AS \"UNT_PRC\" ";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(SUP_AMT)) AS SUP_AMT ";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(VAT_AMT)) AS VAT_AMT ";
            sqlstr += "     , NOTE ";
            sqlstr += " FROM ELVISBILL.EVB_TAX_DTL  ";
            sqlstr += " WHERE  TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 레이어팝업 - 세금계산서 연계문서 데이터
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetTaxDoc(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT DOC_TYPE ";
            sqlstr += "     , LNK_DOC_NO ";
            sqlstr += " FROM ELVISBILL.EVB_TAX_LNKDOC ";
            sqlstr += " WHERE  TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 레이어팝업 - 세금계산서 첨부파일 데이터
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetTaxAttach(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT PRT_FILE_NM ";
            sqlstr += "     , FILE_NM ";
            sqlstr += "     , FILE_PATH ";
            sqlstr += " FROM ELVISBILL.EVB_TAX_ATCH ";
            sqlstr += " WHERE  TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 레이어팝업 - 입금표 상세내역 데이터
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetCreditData(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT A.CRD_DOC_NO ";
            sqlstr += "     , A.CRD_NO  ";
            sqlstr += "     , A.DOC_DIV  ";
            sqlstr += "     , (CASE WHEN A.DOC_DIV = 'C1' THEN '일반' ELSE '대리점' END) As DOC_DIV_NM  ";
            sqlstr += "     , B.SUPLER_BUSN_ID  ";
            sqlstr += "     , B.SUPLER_TRADE_NM  ";
            sqlstr += "     , B.SUPLER_CHIEF_NM ";
            sqlstr += "     , B.DMDER_BUSN_ID  ";
            sqlstr += "     , B.DMDER_TRADE_NM  ";
            sqlstr += "     , B.DMDER_CHIEF_NM ";
            sqlstr += "     , '' As AGENT_BUSN_ID  ";
            sqlstr += "     , '' As AGENT_TRADE_NM  ";
            sqlstr += "     , '' As AGENT_CHIEF_NM  ";
            sqlstr += "     , '' As AGENT_ADDR ";
            sqlstr += "     , A.WRITE_DT  ";
            sqlstr += "     , A.TOT_AMT ";
            sqlstr += "     , (CASE WHEN A.VESSEL IS NOT NULL THEN A.VESSEL || ' ' || A.BL_NO  ";
            sqlstr += "                ELSE A.BL_NO ";
            sqlstr += "                END ) As VESSEL_BL_NO  ";
            sqlstr += "  , (SELECT COUNT(*) FROM ELVISBILL.EVB_CRD_DTL WHERE CRD_DOC_NO = A.CRD_DOC_NO) As DETAIL_CNT ";
            sqlstr += " FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";
            sqlstr += " WHERE  A.DOC_DIV = 'C1' ";
            sqlstr += " AND CRD_DOC_NO = '" + dr["CRD_DOC_NO"].ToString() + "' ";
            sqlstr += " UNION ALL ";
            sqlstr += " SELECT A.CRD_DOC_NO ";
            sqlstr += "     , A.CRD_NO ";
            sqlstr += "     , A.DOC_DIV ";
            sqlstr += "     , (CASE WHEN A.DOC_DIV = 'C1' THEN '일반' ELSE '대리점' END) As DOC_DIV_NM ";
            sqlstr += "     , '' As SUPLER_BUSN_ID ";
            sqlstr += "     , A.LINE_NM As SUPLER_TRADE_NM ";
            sqlstr += "     , '' As SUPLER_CHIEF_NM ";
            sqlstr += "     , B.DMDER_BUSN_ID ";
            sqlstr += "     , B.DMDER_TRADE_NM ";
            sqlstr += "     , B.DMDER_CHIEF_NM ";
            sqlstr += "     , B.SUPLER_BUSN_ID As AGENT_BUSN_ID ";
            sqlstr += "     , B.SUPLER_TRADE_NM As AGENT_TRADE_NM ";
            sqlstr += "     , B.SUPLER_CHIEF_NM As AGENT_CHIEF_NM ";
            sqlstr += "     , B.SUPLER_ADDR As AGENT_ADDR ";
            sqlstr += "     , A.WRITE_DT ";
            sqlstr += "     , A.TOT_AMT ";
            sqlstr += "     , (CASE WHEN A.VESSEL IS NOT NULL THEN A.VESSEL || ' ' || A.BL_NO  ";
            sqlstr += "                ELSE A.BL_NO ";
            sqlstr += "                END ) As VESSEL_BL_NO ";
            sqlstr += "  , (SELECT COUNT(*) FROM ELVISBILL.EVB_CRD_DTL WHERE CRD_DOC_NO = A.CRD_DOC_NO) As DETAIL_CNT ";
            sqlstr += " FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";
            sqlstr += " WHERE  A.DOC_DIV = 'C2' ";
            sqlstr += " AND CRD_DOC_NO = '" + dr["CRD_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 입금표 내역 리스트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetCreditList(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT SEQ_NO ";
            sqlstr += "     , FRT_NM ";
            sqlstr += "     , CURR_CD ";
            sqlstr += "     , EX_RATE ";
            sqlstr += "     , FREGN_AMT ";
            sqlstr += "     , LOCAL_AMT ";
            sqlstr += " FROM ELVISBILL.EVB_CRD_DTL ";
            sqlstr += " WHERE CRD_DOC_NO = '" + dr["CRD_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 엘비스 빌 국세청 승인 Status 변경
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnSetApproval_Update(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " UPDATE ELVISBILL.EVB_TAX_MST ";
            sqlstr += " SET LAST_DOC_STATUS = 'BS' ";
            sqlstr += "     , ISU_STATUS_CD = 'R' ";
            sqlstr += " WHERE  TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";
            sqlstr += " AND ISU_STATUS_CD = 'N' ";
            sqlstr += " AND LAST_DOC_STATUS = 'SO' ";

            return sqlstr;
        }

        /// <summary>
        /// 엘비스 빌 국세청 승인 내용 추가
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnSetApproval_Insert(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " INSERT INTO ELVISBILL.EVB_TAX_STAS (TAX_DOC_NO, SEQ_NO, RCPT_CD, RCPT_NM, RCPT_RSPN, RCPT_COMT, MAIL_SND_YN, INS_USR, INS_YMD, INS_HM) ";
            sqlstr += " VALUES ('" + dr["TAX_DOC_NO"].ToString() + "' ";
            sqlstr += "              , (SELECT MAX(SEQ_NO) + 1 ";
            sqlstr += "                 FROM ELVISBILL.EVB_TAX_STAS ";
            sqlstr += "                 WHERE TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "') ";
            sqlstr += "             , 'BS' ";
            sqlstr += "             , '승인' ";
            sqlstr += "             , '' ";
            sqlstr += "             , '승인 처리 되었습니다.' ";
            sqlstr += "             , 'N' ";
            sqlstr += "             , '_SITESYS_' ";
            sqlstr += "             , ELVISBILL.UFN_DATE_FORMAT('DATE') ";
            sqlstr += "             , ELVISBILL.UFN_DATE_FORMAT('TIME') ";
            sqlstr += "             ) ";

            return sqlstr;
        }

        /// <summary>
        /// 엘비스 빌 국세청 승인 Status 변경
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnSetApproval_Update(string strTAX_DOC_NO)
        {
            sqlstr = "";

            sqlstr += " UPDATE ELVISBILL.EVB_TAX_MST ";
            sqlstr += " SET LAST_DOC_STATUS = 'BS' ";
            sqlstr += "     , ISU_STATUS_CD = 'R' ";
            sqlstr += " WHERE  TAX_DOC_NO = '" + strTAX_DOC_NO + "' ";
            sqlstr += " AND ISU_STATUS_CD = 'N' ";
            sqlstr += " AND LAST_DOC_STATUS = 'SO' ";

            return sqlstr;
        }

        /// <summary>
        /// 엘비스 빌 국세청 승인 내용 추가
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnSetApproval_Insert(string strTAX_DOC_NO)
        {
            sqlstr = "";

            sqlstr += " INSERT INTO ELVISBILL.EVB_TAX_STAS (TAX_DOC_NO, SEQ_NO, RCPT_CD, RCPT_NM, RCPT_RSPN, RCPT_COMT, MAIL_SND_YN, INS_USR, INS_YMD, INS_HM) ";
            sqlstr += " VALUES ('" + strTAX_DOC_NO + "' ";
            sqlstr += "              , (SELECT MAX(SEQ_NO) + 1 ";
            sqlstr += "                 FROM ELVISBILL.EVB_TAX_STAS ";
            sqlstr += "                 WHERE TAX_DOC_NO = '" + strTAX_DOC_NO + "') ";
            sqlstr += "             , 'BS' ";
            sqlstr += "             , '승인' ";
            sqlstr += "             , '' ";
            sqlstr += "             , '승인 처리 되었습니다.' ";
            sqlstr += "             , 'N' ";
            sqlstr += "             , '_SITESYS_' ";
            sqlstr += "             , ELVISBILL.UFN_DATE_FORMAT('DATE') ";
            sqlstr += "             , ELVISBILL.UFN_DATE_FORMAT('TIME') ";
            sqlstr += "             ) ";

            return sqlstr;
        }


        /// <summary>
        /// 엘비스 빌 국세청 거절 Status 변경
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnSetRefuse_Update(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " UPDATE ELVISBILL.EVB_TAX_MST ";
            sqlstr += " SET LAST_DOC_STATUS = 'BR' ";
            sqlstr += " WHERE  TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// 엘비스 빌 국세청 거절 내용 추가
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnSetRefuse_Insert(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " INSERT INTO ELVISBILL.EVB_TAX_STAS (TAX_DOC_NO, SEQ_NO, RCPT_CD, RCPT_NM, RCPT_RSPN, RCPT_COMT, MAIL_SND_YN, INS_USR, INS_YMD, INS_HM) ";
            sqlstr += " VALUES ('" + dr["TAX_DOC_NO"].ToString() + "' ";
            sqlstr += "              , (SELECT MAX(SEQ_NO) + 1 ";
            sqlstr += "                 FROM ELVISBILL.EVB_TAX_STAS ";
            sqlstr += "                 WHERE TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "') ";
            sqlstr += "             , 'BR' ";
            sqlstr += "             , '거절' ";
            sqlstr += "             , '" + dr["REFUND_REASON"].ToString() + "' ";
            sqlstr += "             , '거절 처리 되었습니다.' ";
            sqlstr += "             , 'N' ";
            sqlstr += "             , '_SITESYS_' ";
            sqlstr += "             , ELVISBILL.UFN_DATE_FORMAT('DATE') ";
            sqlstr += "             , ELVISBILL.UFN_DATE_FORMAT('TIME') ";
            sqlstr += "             ) ";

            return sqlstr;
        }


        /// <summary>
        /// 세금계산서 print 데이터 가져오기
        /// </summary>
        /// <returns></returns>
        public string fnGetExampleTaxPrintData(DataRow dr)
        {
            sqlstr = "";

            //여기서 쿼리 가져오기

            return sqlstr;
        }


        /// <summary>
        /// 세금계산서 print 데이터 가져오기
        /// </summary>
        /// <returns></returns>
        public string fnGetTaxPrintData(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT (CASE WHEN A.ETAXBIL_CL_CD IN ('01', '03') THEN '01' ";
            sqlstr += "                      WHEN A.ETAXBIL_CL_CD IN ('02', '04') THEN '02' ";
            sqlstr += "                      ELSE '03' END) As TAX_DOC_DIV  ";
            sqlstr += "         , (CASE WHEN A.ETAXBIL_CL_CD IN ('01', '02') AND A.ETAXBIL_KND_CD = '01'  THEN '01' ";
            sqlstr += "                      WHEN A.ETAXBIL_CL_CD IN ('01', '02') AND A.ETAXBIL_KND_CD = '02'  THEN '02' ";
            sqlstr += "                      ELSE '03' END) As TAX_CLASS ";
            sqlstr += "         , A.TAX_DOC_NO  ";
            sqlstr += "         , A.ETAX_APPV_NO ";
            sqlstr += "         , A.TAX_MGMT_NO ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.BUSN_ID) As SUP_BUSN_ID ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.CHIEF_NM) As SUP_CHIEF_NM ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B1.TRADE_NM) As SUP_TRADE_NM ";
            sqlstr += "         , B1.ADDR As SUP_ADDR ";
            sqlstr += "         , B1.BUSNSECT_NM As SUP_BUSNSECT_NM ";
            sqlstr += "         , B1.DETAIL_NM As SUP_DETAIL_NM ";
            sqlstr += "         , B1.MAIN_OFFC_NM As SUP_MAIN_OFFC_NM ";
            sqlstr += "         , B1.MAIN_OFFC_DEPT_NM As SUP_MAIN_OFFC_DEPT_NM ";
            sqlstr += "         , B1.MAIN_OFFC_TEL_NO As SUP_MAIN_OFFC_TEL_NO ";
            sqlstr += "         , B1.MAIN_OFFC_MTEL_NO As SUP_MAIN_OFFC_MTEL_NO ";
            sqlstr += "         , B1.MAIN_OFFC_EMAIL_ADDR As SUP_MAIN_OFFC_EMAIL_ADDR ";
            sqlstr += "         , B1.SUB_BD_NO As SUP_SUB_BD_NO ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B2.BUSN_ID) As DMD_BUSN_ID ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B2.CHIEF_NM) As DMD_CHIEF_NM ";
            sqlstr += "         , ELVISBILL.CRYPTO_AES256.DEC_AES(B2.TRADE_NM) As DMD_TRADE_NM ";
            sqlstr += "         , B2.ADDR As DMD_ADDR ";
            sqlstr += "         , B2.BUSNSECT_NM As DMD_BUSNSECT_NM ";
            sqlstr += "         , B2.DETAIL_NM As DMD_DETAIL_NM ";
            sqlstr += "         , B2.MAIN_OFFC_NM As DMD_MAIN_OFFC_NM ";
            sqlstr += "         , B2.MAIN_OFFC_DEPT_NM As DMD_MAIN_OFFC_DEPT_NM ";
            sqlstr += "         , B2.MAIN_OFFC_TEL_NO As DMD_MAIN_OFFC_TEL_NO ";
            sqlstr += "         , B2.MAIN_OFFC_MTEL_NO As DMD_MAIN_OFFC_MTEL_NO ";
            sqlstr += "         , B2.MAIN_OFFC_EMAIL_ADDR As DMD_MAIN_OFFC_EMAIL_ADDR ";
            sqlstr += "         , B2.SUB_BD_NO As DMD_SUB_BD_NO ";
            sqlstr += "         , A.WRITE_DT ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.SUP_SM_AMT)) AS SUP_SM_AMT ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.VAT_SM_AMT)) AS VAT_SM_AMT ";
            sqlstr += "         , A.WF_AMT ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) AS TOT_AMT ";
            sqlstr += "         , A.WF_AMT + TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) AS WF_TOT_AMT ";
            sqlstr += "         , REPLACE(REPLACE(A.ETAXBIL_NOTE, chr(13), ' '), chr(10), '') AS ETAXBIL_NOTE "; // twkim - 띄어쓰기 수정
            sqlstr += "         , A.LAST_DOC_STATUS ";
            sqlstr += "         , C2.COM_NM As LAST_DOC_STATUS_NM ";
            sqlstr += "         , C1.COM_NM As ETAXBIL_RVS_CS_NM ";
            sqlstr += "         , D.SEQ_NO ";
            sqlstr += "         , D.PURCHS_DT ";
            sqlstr += "         , SUBSTR(D.PURCHS_DT,5,2) AS MM ";
            sqlstr += "         , SUBSTR(D.PURCHS_DT,7,2) AS DD ";
            sqlstr += "         , D.THNG_NM ";
            sqlstr += "         , D.STNDRD_NM ";
            sqlstr += "         , D.QTY ";
            sqlstr += "         , D.UNT_PRC ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(D.SUP_AMT)) AS SUP_AMT ";
            sqlstr += "         , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(D.VAT_AMT)) AS VAT_AMT ";
            sqlstr += "         , D.NOTE AS NOTE ";
            sqlstr += "         , (SELECT (CASE WHEN E.SETTLE_WHG_INCLUDE_PRT_YN = 'Y' AND NVL(LOCAL_AMT,0) <> 0 THEN A.WF_AMT + TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) ";
            sqlstr += "                         ELSE NVL(LOCAL_AMT,0) END) FROM ELVISBILL.EVB_TAX_SETL WHERE TAX_DOC_NO = A.TAX_DOC_NO AND SETLE_METD_CD = '10') AS CASH_AMT ";
            sqlstr += "         , (SELECT (CASE WHEN E.SETTLE_WHG_INCLUDE_PRT_YN = 'Y' AND NVL(LOCAL_AMT,0) <> 0 THEN A.WF_AMT + TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) ";
            sqlstr += "                         ELSE NVL(LOCAL_AMT,0) END) FROM ELVISBILL.EVB_TAX_SETL WHERE TAX_DOC_NO = A.TAX_DOC_NO AND SETLE_METD_CD = '20') AS CHECK_AMT ";
            sqlstr += "         , (SELECT (CASE WHEN E.SETTLE_WHG_INCLUDE_PRT_YN = 'Y' AND NVL(LOCAL_AMT,0) <> 0 THEN A.WF_AMT + TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) ";
            sqlstr += "                         ELSE NVL(LOCAL_AMT,0) END) FROM ELVISBILL.EVB_TAX_SETL WHERE TAX_DOC_NO = A.TAX_DOC_NO AND SETLE_METD_CD = '30') AS PROM_AMT ";
            sqlstr += "         , (SELECT (CASE WHEN E.SETTLE_WHG_INCLUDE_PRT_YN = 'Y' AND NVL(LOCAL_AMT,0) <> 0 THEN A.WF_AMT + TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(A.TOT_AMT)) ";
            sqlstr += "                         ELSE NVL(LOCAL_AMT,0) END) FROM ELVISBILL.EVB_TAX_SETL WHERE TAX_DOC_NO = A.TAX_DOC_NO AND SETLE_METD_CD = '40') AS CREDIT_AMT ";
            sqlstr += "         , (CASE WHEN A.ETAXBIL_TP_CD = '01' THEN '영수' ELSE '청구' END) AS ETAXBIL_TP_NM ";
            sqlstr += "         , A.BANK_INFO ";
            sqlstr += "         , E.TAX_FIX_NOTE ";
            sqlstr += " FROM  ELVISBILL.EVB_TAX_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B1 ON A.TAX_DOC_NO = B1.TAX_DOC_NO AND B1.BUSN_KND_CD = '01' ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_OFFC B2 ON A.TAX_DOC_NO = B2.TAX_DOC_NO AND B2.BUSN_KND_CD = '02' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C1 ON A.ETAXBIL_RVS_CS_CD = C1.COM_CD AND C1.GRP_CD = 'RVS_CS_CD' ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_COM_CD C2 ON A.LAST_DOC_STATUS = C2.COM_CD AND C2.GRP_CD = 'ETAX_RCPT_CD' ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_TAX_DTL D ON A.TAX_DOC_NO = D.TAX_DOC_NO ";
            sqlstr += " LEFT JOIN ELVISBILL.EVB_MEMB_SET E ON A.INS_USR = E.USER_AUTH_ID ";
            sqlstr += " WHERE  A.TAX_DOC_NO = '" + dr["TAX_DOC_NO"].ToString() + "' ";

            return sqlstr;
        }

        /// <summary>
        /// -- 일반입금표 
        /// </summary>
        /// <returns></returns>
        public string fnGetCreateSlip(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT A.CRD_DOC_NO ";
            sqlstr += "     , A.CRD_NO ";
            sqlstr += "     , A.DOC_DIV ";
            sqlstr += "     , (CASE WHEN A.DOC_DIV = 'C1' THEN '일반' ELSE '대리점' END) As DOC_DIV_NM ";
            sqlstr += "     , B.SUPLER_BUSN_ID ";
            sqlstr += "     , B.SUPLER_TRADE_NM ";
            sqlstr += "     , B.SUPLER_CHIEF_NM ";
            sqlstr += "     , B.SUPLER_ADDR ";
            sqlstr += "     , B.SUPLER_BUSNSECT_NM ";
            sqlstr += "     , B.SUPLER_DETAIL_NM  ";
            sqlstr += "     , B.DMDER_TRADE_NM  ";
            sqlstr += "     , (CASE WHEN A.VESSEL IS NOT NULL THEN A.VESSEL || ' ' || A.BL_NO  ";
            sqlstr += "                ELSE A.BL_NO ";
            sqlstr += "                END ) As BL_NO ";
            sqlstr += "     , C.FRT_NM ";
            sqlstr += "     , C.FREGN_AMT ";
            sqlstr += "     , C.LOCAL_AMT ";
            sqlstr += "     , A.TOT_AMT ";
            sqlstr += "     , A.WRITE_DT ";
            sqlstr += "     , B.SUPLER_OFFC_NM ";
            sqlstr += " FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_CRD_DTL C ON A.CRD_DOC_NO = C.CRD_DOC_NO ";
            sqlstr += " WHERE  A.DOC_DIV = 'C1' ";
            sqlstr += " AND A.CRD_DOC_NO = '" + dr["CRD_DOC_NO"].ToString() + "' ";
            sqlstr += " ORDER BY C.CRD_DOC_NO,  C.SEQ_NO ";

            return sqlstr;
        }

        public string fnGetKeep_CreateSlip(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT A.CRD_DOC_NO ";
            sqlstr += "     , A.DOC_DIV ";
            sqlstr += "     , (CASE WHEN A.DOC_DIV = 'C1' THEN '일반' ELSE '대리점' END) As DOC_DIV_NM    ";
            sqlstr += "     , A.LINE_NM As SUPLER_TRADE_NM ";
            sqlstr += "     , A.CRD_NO ";
            sqlstr += "     , B.DMDER_BUSN_ID ";
            sqlstr += "     , B.DMDER_TRADE_NM ";
            sqlstr += "     , B.DMDER_CHIEF_NM ";
            sqlstr += "     , B.DMDER_ADDR ";
            sqlstr += "     , B.SUPLER_BUSN_ID As AGENT_BUSN_ID ";
            sqlstr += "     , B.SUPLER_TRADE_NM As AGENT_TRADE_NM ";
            sqlstr += "     , B.SUPLER_CHIEF_NM As AGENT_CHIEF_NM ";
            sqlstr += "     , B.SUPLER_ADDR As AGENT_ADDR ";
            sqlstr += "     , A.WRITE_DT ";
            sqlstr += "     , A.TOT_AMT ";
            sqlstr += "     , (CASE WHEN A.VESSEL IS NOT NULL THEN A.VESSEL || ' ' || A.BL_NO  ";
            sqlstr += "                ELSE A.BL_NO ";
            sqlstr += "                END ) As BL_NO ";
            sqlstr += "     , C.FRT_CD ";
            sqlstr += "     , C.EX_RATE ";
            sqlstr += "     , C.FREGN_AMT ";
            sqlstr += "     , C.LOCAL_AMT ";
            sqlstr += "     , A.SETLE_DIV ";
            sqlstr += " FROM ELVISBILL.EVB_CRD_MST A ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC B ON A.CRD_DOC_NO = B.ADD_DOC_NO ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_CRD_DTL C ON A.CRD_DOC_NO = C.CRD_DOC_NO ";
            sqlstr += " WHERE  A.DOC_DIV = 'C2' ";
            sqlstr += " AND A.CRD_DOC_NO = '" + dr["CRD_DOC_NO"].ToString() + "' ";
            sqlstr += " ORDER BY A.CRD_DOC_NO, C.SEQ_NO ";

            return sqlstr;
        }

        /// <summary>
        /// 세금계산서 Log 심어주기
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnLog_GetTaxPrint_SELECT(DataRow dr,string strFunctionNM)
        {
            sqlstr = "";

            sqlstr += " INSERT INTO ELVISBILL.EVB_LOG (LOGIN_TYPE, ";
            sqlstr += "                                KEY_NO, ";
            sqlstr += "                                USER_IP_INFO, ";
            sqlstr += "                                ACTION_DATE, ";
            sqlstr += "                                ACTION_TIME, ";
            sqlstr += "                                SEQ, ";
            sqlstr += "                                ACTION_DIV, ";
            sqlstr += "                                PARAM, ";
            sqlstr += "                                SQL_LOG, ";
            sqlstr += "                                DATA_LOG) ";

            if(dr["LOGIN_TYPE"].ToString() == "E")
            {
                sqlstr += "      VALUES ('" + dr["LOGIN_TYPE"].ToString() + "', ";
            }
            else
            {
                sqlstr += "      VALUES ('S', ";
            }
            
            sqlstr += "              '"+dr["KEY_NO"].ToString()+"', ";
            sqlstr += "              '', ";
            sqlstr += "              TO_CHAR (SYSDATE, 'yyyymmdd'), ";
            sqlstr += "              TO_CHAR (SYSDATE, 'hh24miss'), ";
            sqlstr += "              '1', ";            
            sqlstr += "              'SELECT', ";
            sqlstr += "              '" + dr["TAX_DOC_NO"].ToString() + "', ";
            //sqlstr += "              '" + fnGetTaxPrintData(dr).Replace("'","`") + "', ";
            sqlstr += "              '"+ strFunctionNM + "', ";
            sqlstr += "              '') ";

            return sqlstr;
        }

        /// <summary>
        /// 세금계산서 Log 심어주기
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnLog_GetTaxPrint_PRINT(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " INSERT INTO ELVISBILL.EVB_LOG (LOGIN_TYPE, ";
            sqlstr += "                                KEY_NO, ";
            sqlstr += "                                USER_IP_INFO, ";
            sqlstr += "                                ACTION_DATE, ";
            sqlstr += "                                ACTION_TIME, ";
            sqlstr += "                                SEQ, ";
            sqlstr += "                                ACTION_DIV, ";
            sqlstr += "                                PARAM, ";
            sqlstr += "                                SQL_LOG, ";
            sqlstr += "                                DATA_LOG) ";
            
            if (dr["LOGIN_TYPE"].ToString() == "E")
            {
                sqlstr += "      VALUES ('" + dr["LOGIN_TYPE"].ToString() + "', ";
            }
            else
            {
                sqlstr += "      VALUES ('S', ";
            }
            
            sqlstr += "              '" + dr["KEY_NO"].ToString() + "', ";
            sqlstr += "              '', ";
            sqlstr += "              TO_CHAR (SYSDATE, 'yyyymmdd'), ";
            sqlstr += "              TO_CHAR (SYSDATE, 'hh24miss'), ";
            sqlstr += "              '2', ";
            sqlstr += "              'PRINT', ";
            sqlstr += "              '" + dr["TAX_DOC_NO"].ToString() + "', ";
            sqlstr += "              '', ";
            sqlstr += "              '" + dr["JSON_DATA"].ToString() + "') ";

            return sqlstr;
        }

        /// <summary>
        /// 세금계산서 Log 심어주기
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnLog_GetTaxPrint_END(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " INSERT INTO ELVISBILL.EVB_LOG (LOGIN_TYPE, ";
            sqlstr += "                                KEY_NO, ";
            sqlstr += "                                USER_IP_INFO, ";
            sqlstr += "                                ACTION_DATE, ";
            sqlstr += "                                ACTION_TIME, ";
            sqlstr += "                                SEQ, ";
            sqlstr += "                                ACTION_DIV, ";
            sqlstr += "                                PARAM, ";
            sqlstr += "                                SQL_LOG, ";
            sqlstr += "                                DATA_LOG) ";
            
            if (dr["LOGIN_TYPE"].ToString() == "E")
            {
                sqlstr += "      VALUES ('" + dr["LOGIN_TYPE"].ToString() + "', ";
            }
            else
            {
                sqlstr += "      VALUES ('S', ";
            }
            
            sqlstr += "              '" + dr["KEY_NO"].ToString() + "', ";
            sqlstr += "              '', ";
            sqlstr += "              TO_CHAR (SYSDATE, 'yyyymmdd'), ";
            sqlstr += "              TO_CHAR (SYSDATE, 'hh24miss'), ";
            sqlstr += "              '3', ";
            sqlstr += "              'END', ";
            sqlstr += "              '" + dr["TAX_DOC_NO"].ToString() + "', ";
            sqlstr += "              '', ";
            sqlstr += "              '" + dr["JSON_DATA"].ToString() + "') ";

            return sqlstr;
        }





    }
}
