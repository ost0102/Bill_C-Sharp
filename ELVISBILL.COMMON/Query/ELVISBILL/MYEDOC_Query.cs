using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace ELVISBILL.COMMON.Query.ELVISBILL
{
    public class MYEDOC_Query
    {
        string sqlstr;

        #region ★★★★Mydoc Query★★★★
        /// <summary>
        /// MyEdoc 메인 리스트 조회 쿼리
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnGetMyEdocList(DataRow dr)
        {
            sqlstr = "";


            sqlstr += " SELECT * ";
            sqlstr += "   FROM (SELECT ROWNUM AS RNUM, ";
            sqlstr += "                FLOOR ((COUNT(*) OVER () /10)+1) TOT_PAGE, ";
            sqlstr += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE, ";
            sqlstr += "                COUNT (*) OVER () AS TOTCNT, ";
            sqlstr += "                TOTAL.* ";
            sqlstr += "         FROM  ( ";

            #region 세금 계산서
            sqlstr += "SELECT '" + dr["BUSN_TYPE"].ToString() + "' AS BUSN_TYPE "; //01(공급하는자 조건) | 02(공급받는자 조건)
            sqlstr += "     , MST.TAX_MGMT_NO AS TAX_MGMT_NO "; //계산서번호
            sqlstr += "     , 'T' AS DOC_TYPE_CD ";
            sqlstr += "     , MST.TAX_DOC_NO "; //PK 관리번호
            sqlstr += "     , MST.LAST_DOC_STATUS "; //마스터 응답코드 (표기값엔 별도로 사용 X)
            #region 전송상태 구분 값
            sqlstr += "     , (CASE WHEN SUBSTR(MST.LAST_DOC_STATUS,1,1) != 'N' THEN MST.LAST_DOC_STATUS ";
            sqlstr += "             ELSE (SELECT RCPT_CD ";
            sqlstr += "                     FROM ELVISBILL.EVB_TAX_STAS ";
            sqlstr += "                     WHERE TAX_DOC_NO = MST.TAX_DOC_NO ";
            sqlstr += "                     AND INS_YMD||INS_HM = (SELECT MAX(INS_YMD||INS_HM) ";
            sqlstr += "                                             FROM ELVISBILL.EVB_TAX_STAS ";
            sqlstr += "                                             WHERE TAX_DOC_NO = MST.TAX_DOC_NO ";
            sqlstr += "                                             AND RCPT_CD IN('SO','BS','BR','LF')) ";
            sqlstr += "                     AND RCPT_CD IN ('SO','BS','BR','LF')) ";
            sqlstr += "             END) AS LAST_DOC_STATUS1 "; //전송상태코드값1 (승인|문서접수|발행취소|승인대기?)
            sqlstr += "     , (CASE WHEN SUBSTR(MST.LAST_DOC_STATUS,1,1) != 'N' THEN COM2.COM_NM ";
            sqlstr += "             ELSE (SELECT CC.COM_NM ";
            sqlstr += "                     FROM ELVISBILL.EVB_TAX_STAS AC ";
            sqlstr += "                     LEFT JOIN ELVISBILL.EVB_COM_CD CC ";
            sqlstr += "                             ON AC.RCPT_CD = CC.COM_CD ";
            sqlstr += "                            AND CC.GRP_CD = 'ETAX_RCPT_CD' ";
            sqlstr += "                     WHERE AC.TAX_DOC_NO = MST.TAX_DOC_NO ";
            sqlstr += "                     AND AC.INS_YMD || AC.INS_HM = (SELECT MAX (INS_YMD || INS_HM) ";
            sqlstr += "                                                     FROM ELVISBILL.EVB_TAX_STAS ";
            sqlstr += "                                                     WHERE TAX_DOC_NO = MST.TAX_DOC_NO ";
            sqlstr += "                                                     AND RCPT_CD IN ('SO','BS','BR','LF')) ";
            sqlstr += "                     AND RCPT_CD IN ('SO', 'BS', 'BR', 'LF')) ";
            sqlstr += "         END) AS LAST_DOC_STATUS_NM1 "; // 전송상태명1 (승인|문서접수|발행취소|승인대기?)
            sqlstr += "     , (CASE WHEN SUBSTR(MST.LAST_DOC_STATUS,1,1) = 'N' THEN MST.LAST_DOC_STATUS ELSE '' END) AS LAST_DOC_STATUS2 ";//전송상태코드값2 (국세청 관련 표기)
            sqlstr += "     , (CASE WHEN SUBSTR(MST.LAST_DOC_STATUS,1,1) = 'N' THEN  COM2.COM_NM ELSE '' END) AS LAST_DOC_STATUS_NM2 "; //전송상태명2(국세청 관련 표기)
            #endregion
            #region 세금 구분
            sqlstr += "     , MST.ETAXBIL_CL_CD ";//세금 구분을 위한 분류자
            sqlstr += "     , MST.ETAXBIL_KND_CD "; //세금 구분을 위한 종류자
            sqlstr += "     , (CASE WHEN MST.ETAXBIL_CL_CD IN('01','02') THEN (CASE WHEN MST.ETAXBIL_KND_CD = '01' THEN '과세' ";
            sqlstr += "                                                             WHEN MST.ETAXBIL_KND_CD = '02' THEN '영세' ";
            sqlstr += "                                                             WHEN MST.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr += "                                                             ELSE'수입'   END) ";
            sqlstr += "             ELSE (CASE WHEN MST.ETAXBIL_KND_CD = '01' THEN '면세' ";
            sqlstr += "                        WHEN MST.ETAXBIL_KND_CD = '02' THEN '면세' ";
            sqlstr += "                        WHEN MST.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            sqlstr += "                        ELSE '수입' END) END) AS DOC_DIV "; // 세금 종류
            #endregion
            sqlstr += "     , COM3.COM_NM  AS ETAXBIL_TP_NM "; //(청구||영수)

            sqlstr += "     , SUBSTR(MST.ISU_DATE,1,8) AS ISU_DATE "; //발행일자
            sqlstr += "     , MST.WRITE_DT AS WRITE_DT "; //작성일자
            #region 조건에 따른 공급자/공급받는자 구분
            sqlstr += "     , '" + dr["BUSN_TYPE"].ToString() + "' AS TRADE_TYPE";
            if (dr["BUSN_TYPE"].ToString() == "01") // 공급하는자 조건일 경우
            {
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(RESUP.TRADE_NM) AS  DMDER_TRADE_NM "; //공급받는자 명
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(RESUP.BUSN_ID) AS DMDER_TRADE_ID "; //공급받는자 사업등록번호
            }
            else if (dr["BUSN_TYPE"].ToString() == "02") // 공급받는자 조건일 경우
            {
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.TRADE_NM) AS  DMDER_TRADE_NM "; //공급하는자 명
                sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.BUSN_ID) AS DMDER_TRADE_ID "; //공급하는자 사업등록번호
            }
            #endregion
            sqlstr += "     , MST.BL_NO "; //BL 번호
            #region 금액관련 컬럼
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(MST.SUP_SM_AMT)) AS SUP_SM_AMT "; // 공가금액
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES(MST.VAT_SM_AMT)) AS VAT_SM_AMT "; // 부가세액
            sqlstr += "     , MST.WF_AMT AS WF_AMT "; //대납비용
            sqlstr += "     , TO_NUMBER (ELVISBILL.CRYPTO_AES256.DEC_AES (MST.TOT_AMT))+ MST.WF_AMT AS TOT_AMT "; //합계
            #endregion

            sqlstr += "     , '1' AS DISC_TYPE ";

            #region 테이블
            sqlstr += "     , MST.INS_YMD || MST.INS_HM  AS INS_DATE ";
            sqlstr += " FROM ELVISBILL.EVB_TAX_MST MST "; // 마스터 테이블

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

            sqlstr += " INNER JOIN ELVISBILL.EVB_COM_CD COM3 "; //세금 세부내용 구분
            sqlstr += "        ON MST.ETAXBIL_TP_CD = COM3.COM_CD ";
            sqlstr += "        AND COM3.GRP_CD = 'RCPT_RQEST_TP_CD' ";
            #endregion

            #region 조회조건
            //세금계산서 체크 유무
            if(dr["ChkBill"].ToString() == "true")
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
                sqlstr += " AND   ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.BUSN_ID) = '"+dr["BUSN_NO"].ToString()+"' ";
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
                    if(VatList[0].ToString() != "'02'")
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

            //UNION 시 마지막에 정렬
            ////정렬
            //if (dr["SAECH_DT_TYPE"].ToString() != null && dr["SAECH_DT_TYPE"].ToString() == "W") {//작성일 기준
            //    sqlstr += " ORDER BY WRITE_DT DESC";
            //}
            //else //발급일 기준
            //{
            //    sqlstr += " ORDER BY ISU_DATE DESC ";
            //}


            #endregion


            #endregion

            sqlstr += " UNION ALL ";

            #region 입금표
            sqlstr += "SELECT '" + dr["BUSN_TYPE"].ToString() + "' AS BUSN_TYPE "; //01(공급하는자 조건) | 02(공급받는자 조건)
            sqlstr += "     , MST.CRD_NO AS TAX_MGMT_NO "; //계산서번호
            sqlstr += "     , 'R' AS DOC_TYPE_CD ";
            sqlstr += "     , MST.CRD_DOC_NO AS TAX_DOC_NO "; //PK 관리번호
            sqlstr += "     , 'SO' AS LAST_DOC_STATUS "; //마스터 응답코드 (표기값엔 별도로 사용 X)
            sqlstr += "     , 'SO' AS LAST_DOC_STATUS1 ";
            sqlstr += "     , '문서접수' AS LAST_DOC_STATUS_NM1 ";
            sqlstr += "     , '' AS LAST_DOC_STATUS2 ";
            sqlstr += "     , '' AS LAST_DOC_STATUS_NM2 ";

            sqlstr += "     , NULL AS ETAXBIL_CL_CD ";//세금 구분을 위한 분류자
            sqlstr += "     , MST.DOC_DIV AS ETAXBIL_KND_CD "; //세금 구분을 위한 종류자
            sqlstr += "     ,  (CASE WHEN MST.DOC_DIV = 'C1' THEN '일반입금표' ELSE '대리점입금표' END) As DOC_DIV ";
            sqlstr += "     , ''  AS ETAXBIL_TP_NM "; //(청구||영수) 
            sqlstr += "     , SUBSTR(MST.ISU_DATE, 1,8) As ISU_DATE "; //발행일
            sqlstr += "     , '0' AS WRITE_DT "; //작성일자

            #region 조건에따른 공급하는자/공급받는자 구분
            sqlstr += "     , '" + dr["BUSN_TYPE"].ToString() + "' AS TRADE_TYPE";
            if (dr["BUSN_TYPE"].ToString() == "01") // 공급하는자 조건일 경우
            {
                sqlstr += "     , EAO.SUPLER_TRADE_NM AS  DMDER_TRADE_NM "; //공급받는자 명
                sqlstr += "     , EAO.SUPLER_BUSN_ID AS DMDER_TRADE_ID "; //공급받는자 사업등록번호
            }
            else if (dr["BUSN_TYPE"].ToString() == "02") // 공급받는자 조건일 경우
            {
                sqlstr += "     , EAO.DMDER_TRADE_NM AS  DMDER_TRADE_NM "; //공급하는자 명
                sqlstr += "     , EAO.DMDER_BUSN_ID AS DMDER_TRADE_ID "; //공급하는자 사업등록번호
            }
            #endregion
            sqlstr += "     , MST.BL_NO "; //BL 번호
            
            #region 금액
            sqlstr += "     , 0 As SUP_SM_AMT ";
            sqlstr += "     , 0 As VAT_SM_AMT ";
            sqlstr += "     , 0 AS WF_AMT "; 
            sqlstr += "     , MST.TOT_AMT As TOT_AMT ";
            #endregion
            sqlstr += "     , MST.INS_YMD || MST.INS_HM AS INS_DATE     ";

            sqlstr += "     , '2' AS DISC_TYPE ";

            #region 테이블

            sqlstr += " FROM ELVISBILL.EVB_CRD_MST MST ";
            sqlstr += " INNER JOIN ELVISBILL.EVB_ADD_OFFC EAO ";
            sqlstr += "     ON MST.CRD_DOC_NO = EAO.ADD_DOC_NO ";
            #endregion


            #region 조회조건
            //입금표 체크 유무
            if(dr["ChkCredit"].ToString() == "true")
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
                sqlstr += " AND   EAO.DMDER_BUSN_ID = '" + dr["BUSN_NO"].ToString() + "' ";
            }
            else //본인이 공급받는자 일경우
            {
                sqlstr += " AND   EAO.SUPLER_BUSN_ID = '" + dr["BUSN_NO"].ToString() + "' ";
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
                    sqlstr += "         AND MST.CRD_NO = '" + dr["TAX_MGMT_NO"].ToString() + "' ";
                }
            }


            if (dr.Table.Columns.Contains("TRADE_NM")) //공급하는자|공급받는자
            {
                if (dr["BUSN_TYPE"].ToString() == "01" && dr["TRADE_NM"].ToString() != "") // 공급하는자 선택시 (공급받는자 조건으로 검색)
                {
                    sqlstr += "         AND EAO.SUPLER_TRADE_NM LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
                else if (dr["BUSN_TYPE"].ToString() == "02" && dr["TRADE_NM"].ToString() != "")// 공급받는자 선택시 (공급하는자 조건으로 검색)
                {
                    sqlstr += "         AND EAO.DMDER_TRADE_NM LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
            }




            //정렬
            if (dr["SAECH_DT_TYPE"].ToString() != null && dr["SAECH_DT_TYPE"].ToString() == "W")
            {//작성일 기준
                sqlstr += " ORDER BY WRITE_DT DESC";
            }
            else //발급일 기준
            {
                sqlstr += " ORDER BY ISU_DATE DESC, DISC_TYPE ";
            }

            #endregion



            #endregion

            sqlstr += " ) TOTAL ) ";
            sqlstr += " WHERE 1=1 ";
            sqlstr += " AND PAGE = '"+dr["PAGE"].ToString()+"' ";



            return sqlstr;
        }

        /// <summary>
        /// 토탈값 검색
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnMyEdocList_Total(DataRow dr) {
            sqlstr = "";

            //sqlstr += "SELECT TOTAL.* ";
            sqlstr += " SELECT ";
            sqlstr += " COUNT(TOTAL.SITE)AS AMT_CNT ";
            sqlstr += "  ,SUM(TOTAL.SUP_AMT) AS SUP_TOT ";
            sqlstr += ",SUM(TOTAL.VAT_AMT) AS VAT_TOT ";
            sqlstr += " , SUM(TOTAL.WF_AMT) WF_TOT ";
            sqlstr += ", SUM(TOTAL.TOT_AMT)AS AMT_TOT ";
            sqlstr += " FROM ( ";

            #region 세금계산서
            sqlstr += "SELECT 'ELVISBILL' AS SITE ";
            //sqlstr += "     , COM1.COM_NM AS 문서종류 ";
            //sqlstr += "     , COM2.COM_NM AS 문서상태 ";
            //sqlstr += "     , MST.TAX_MGMT_NO AS 계산서번호 ";
            //sqlstr += "     , (CASE WHEN MST.ETAXBIL_CL_CD IN('01','02') THEN (CASE WHEN MST.ETAXBIL_KND_CD = '01' THEN '과세' ";
            //sqlstr += "                                                             WHEN MST.ETAXBIL_KND_CD = '02' THEN '영세' ";
            //sqlstr += "                                                             WHEN MST.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            //sqlstr += "                                                             ELSE'수입'   END) ";
            //sqlstr += "             ELSE (CASE WHEN MST.ETAXBIL_KND_CD = '01' THEN '면세' ";
            //sqlstr += "                        WHEN MST.ETAXBIL_KND_CD = '02' THEN '면세' ";
            //sqlstr += "                        WHEN MST.ETAXBIL_KND_CD = '03' THEN '위수탁' ";
            //sqlstr += "                        ELSE '수입' END) END) AS 부가가치세 "; // 세금 종류
            //sqlstr += "     , TO_CHAR(TO_DATE(MST.WRITE_DT),'YYYY-MM-DD')  AS 작성일자 ";
            //sqlstr += "     , TO_CHAR(TO_DATE(SUBSTR (MST.ISU_DATE, 1, 8)),'YYYY-MM-DD')  AS 발급일자 ";
            //if (dr["BUSN_TYPE"].ToString() == "01") //공급하는자 조건일 때
            //{
            //    sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(RESUP.TRADE_NM) AS  공급받는자 "; //공급받는자 명
            //}
            //else
            //{
            //    sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(SUP.TRADE_NM) AS  공급하는자 "; //공급하는자 명
            //}

            //sqlstr += "     , MST.BL_NO AS \"B/L NO\" ";

            sqlstr += "     , (ELVISBILL.CRYPTO_AES256.DEC_AES (MST.SUP_SM_AMT)) AS SUP_AMT ";
            sqlstr += "     , (ELVISBILL.CRYPTO_AES256.DEC_AES (MST.VAT_SM_AMT)) AS VAT_AMT   ";
            sqlstr += "     , TO_CHAR (MST.WF_AMT) AS WF_AMT";
            sqlstr += "     , TO_NUMBER(ELVISBILL.CRYPTO_AES256.DEC_AES (MST.TOT_AMT) ) + MST.WF_AMT    AS TOT_AMT ";

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
            sqlstr += "SELECT 'ELVISBILL' AS SITE ";
            //sqlstr += "     , '입금표' AS 문서종류 ";
            //sqlstr += "     , '문서접수' AS 문서상태 ";
            //sqlstr += "     , A.CRD_NO AS 계산서번호 ";
            //sqlstr += "     , '입금표' AS 부가가치세 ";
            //sqlstr += "     , TO_CHAR(TO_DATE(A.WRITE_DT),'YYYY-MM-DD')  AS 작성일자 ";
            //sqlstr += "     , TO_CHAR(TO_DATE(SUBSTR (A.ISU_DATE, 1, 8)),'YYYY-MM-DD')  AS 발급일자 ";
            //if (dr["BUSN_TYPE"].ToString() == "01") //공급하는자 조건일 때
            //{
            //    sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(B.SUPLER_TRADE_NM) AS  공급받는자 "; //공급받는자 명
            //}
            //else
            //{
            //    sqlstr += "     , ELVISBILL.CRYPTO_AES256.DEC_AES(B.DMDER_TRADE_NM) AS  공급하는자 "; //공급하는자 명
            //}

            //sqlstr += "     , A.BL_NO AS \"B/L NO\"";

            sqlstr += "     ,'0' AS SUP_AMT ";
            sqlstr += "     ,'0' AS VAT_AMT   ";
            sqlstr += "     , '0' AS WF_AMT ";
            sqlstr += "     , TO_NUMBER(A.TOT_AMT)  AS TOT_AMT ";


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
                sqlstr += " AND   B.DMDER_BUSN_ID = '" + dr["BUSN_NO"].ToString() + "' ";
            }
            else //본인이 공급받는자 일경우
            {
                sqlstr += " AND   B.SUPLER_BUSN_ID = '" + dr["BUSN_NO"].ToString() + "' ";
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
                    sqlstr += "         AND B.SUPLER_TRADE_NM LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
                else if (dr["BUSN_TYPE"].ToString() == "02" && dr["TRADE_NM"].ToString() != "")// 공급받는자 선택시 (공급하는자 조건으로 검색)
                {
                    sqlstr += "         AND B.DMDER_TRADE_NM LIKE  '%" + dr["TRADE_NM"].ToString() + "%' ";
                }
            }

            #endregion

            #endregion

            sqlstr += " ) TOTAL";
            sqlstr += " WHERE 1=1 ";




            return sqlstr;
        }

        #endregion

    }
}
