using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;

namespace ELVISBILL.COMMON.Query.CRM
{
    public class Notice_Query
    {
        string sqlstr;

        /// <summary>
        /// 공지사항 리스트 가져오기
        /// </summary>
        /// <returns></returns>
        public string GetNoticeList(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT *                                                             ";
            sqlstr += "   FROM (SELECT ROWNUM AS RNUM,                                       ";
            //sqlstr += "                FLOOR ( (ROWNUM - 1) / 5 + 1) AS PAGE,                ";
            sqlstr += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,                "; //EKKIM - UPDATE BILL -> 10건씩 처리
            sqlstr += "                COUNT (*) OVER () AS TOTCNT,                          ";
            sqlstr += "                Z.*                                                   ";
            sqlstr += "           FROM (  SELECT A.BOARD_ID,                                 ";
            sqlstr += "                          A.TITLE,                                    ";
            sqlstr += "                          TO_CHAR (TO_DATE (A.INS_YMD, 'yyyyMMdd'),   ";
            sqlstr += "                                   'yyyy-MM-dd')                      ";
            sqlstr += "                             AS INS_YMD,                              ";
            sqlstr += "                          A.EXP_YMD                                   ";
            sqlstr += "                          ,B.LOC_NM                                   "; //EKKIM - UPDATE BILL -> 작성자 명 표기
            sqlstr += "                     FROM CRM_BOARD_MST A, CRM_USR_MST B              ";
            sqlstr += "                    WHERE 1 = 1 AND A.INS_USR = B.USR_ID              ";
            //sqlstr += "                    AND NVL(EVB_NOTICE_YN,'N') = 'Y'                  ";
            if (dr.Table.Columns.Contains("SVALUE"))
            {
                if (dr["SVALID"].ToString() == "T")
                {
                    sqlstr += "             AND A.TITLE LIKE UPPER('%" + dr["SVALUE"].ToString() + "%') ";
                }
                else if (dr["SVALID"].ToString() == "C")
                {
                    sqlstr += "             AND A.BOARD_BODY LIKE UPPER('%" + dr["SVALUE"].ToString() + "%') ";
                }
                else {
                    sqlstr += "             AND (A.TITLE LIKE UPPER('%"+dr["SVALUE"].ToString()+"%') OR A.BOARD_BODY LIKE UPPER('%"+dr["SVALUE"].ToString()+"%'))";
                }
            }
            sqlstr += "                 ORDER BY A.EXP_YMD DESC,A.INS_YMD DESC, A.NOTICE_YN DESC) Z) PAGING ";
            sqlstr += "  WHERE PAGING.PAGE = '"+dr["PAGE"].ToString()+"'												";

            return sqlstr;
        }

        public string GetNoticeListData(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT BRD.BOARD_ID                                          ";            
            sqlstr += "      , BRD.TITLE                                             ";
            sqlstr += "      , BRD.BOARD_BODY                                        ";
            sqlstr += "   FROM CRM_BOARD_MST BRD                                     ";
            sqlstr += "   WHERE BRD.BOARD_ID = '" + dr["BOARD_ID"].ToString() + "'   ";        

            return sqlstr;
        }

    }
}
