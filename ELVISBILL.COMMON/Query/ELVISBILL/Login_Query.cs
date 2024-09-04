using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace ELVISBILL.COMMON.Query.ELVISBILL
{
    public class Login_Query
    {
        string sqlstr;

        /// <summary>
        /// 사업자번호 체크 로직
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string fnCheckCrn(DataRow dr)
        {
            sqlstr = "";

            sqlstr += " SELECT * ";
            sqlstr += "   FROM (SELECT DOC_NO, ";
            sqlstr += "                ELVISBILL.CRYPTO_AES256.DEC_AES (BUSN_ID) AS BUSN_ID, ";
            sqlstr += "                'S' AS BUSN_TYPE ";
            sqlstr += "           FROM    ELVISBILL.EVB_DOC_INFO A ";
            sqlstr += "                INNER JOIN ";
            sqlstr += "                   ELVISBILL.EVB_TAX_OFFC B ";
            sqlstr += "                ON A.DOC_NO = B.TAX_DOC_NO AND B.BUSN_KND_CD = '01' ";

            if (dr["SearchType"].ToString() == "N")
            {
                sqlstr += "          WHERE DOC_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'TAX' ";
            }
            else
            {
                sqlstr += "          WHERE RCV_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'TAX' ";
            }

            sqlstr += "         UNION ALL ";
            sqlstr += "         SELECT DOC_NO, ";
            sqlstr += "                ELVISBILL.CRYPTO_AES256.DEC_AES (BUSN_ID) AS BUSN_ID, ";
            sqlstr += "                'B' AS BUSN_TYPE ";
            sqlstr += "           FROM    ELVISBILL.EVB_DOC_INFO A ";
            sqlstr += "                INNER JOIN ";
            sqlstr += "                   ELVISBILL.EVB_TAX_OFFC B ";
            sqlstr += "                ON A.DOC_NO = B.TAX_DOC_NO AND B.BUSN_KND_CD = '02' ";            

            if (dr["SearchType"].ToString() == "N")
            {
                sqlstr += "          WHERE DOC_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'TAX' ";
            }
            else
            {
                sqlstr += "          WHERE RCV_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'TAX' ";
            }

            sqlstr += "         UNION ALL ";
            sqlstr += "         SELECT DOC_NO, SUPLER_BUSN_ID AS BUSN_ID, 'S' AS BUSN_TYPE ";
            sqlstr += "           FROM    ELVISBILL.EVB_DOC_INFO A ";
            sqlstr += "                INNER JOIN ";
            sqlstr += "                   ELVISBILL.EVB_ADD_OFFC B ";
            sqlstr += "                ON A.DOC_NO = B.ADD_DOC_NO ";

            if (dr["SearchType"].ToString() == "N")
            {
                sqlstr += "          WHERE DOC_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'CRD' ";
            }
            else
            {
                sqlstr += "          WHERE RCV_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'CRD' ";
            }

            sqlstr += "         UNION ALL ";
            sqlstr += "         SELECT DOC_NO, DMDER_BUSN_ID AS BUSN_ID, 'B' AS BUSN_TYPE ";
            sqlstr += "           FROM    ELVISBILL.EVB_DOC_INFO A ";
            sqlstr += "                INNER JOIN ";
            sqlstr += "                   ELVISBILL.EVB_ADD_OFFC B ";
            sqlstr += "                ON A.DOC_NO = B.ADD_DOC_NO ";

            if (dr["SearchType"].ToString() == "N")
            {
                sqlstr += "          WHERE DOC_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'CRD' ) A1 ";
            }
            else
            {
                sqlstr += "          WHERE RCV_NO = '" + dr["N_VALUE"].ToString() + "' AND DOC_TYPE = 'CRD') A1 ";
            }
            
            sqlstr += "  WHERE BUSN_ID = '" + dr["CRN_NO"].ToString() + "' ";

            return sqlstr;
        }

        public string GetUsrfno(DataRow dr)
        {
            sqlstr = "";

            sqlstr += "SELECT * FROM ELVISBILL.EVB_MEMB_SET ";
            sqlstr += "WHERE 1=1 ";
            sqlstr += "AND USER_ID = UPPER('"+dr["USER_ID"] +"') ";

            if (!dr.Table.Columns.Contains("LOGIN_TYPE")) // URL 로그인이 아닐경우
            {
                // 컬럼쪽은 암호화 처리 될꺼임 추후에 암호화 함수 제거 해야함
                sqlstr += "AND USER_PW = ELVISBILL.UNF_MD5_ENCRYPTION('" + dr["USER_PW"] + "')";
            }
            else //URL 로그인 일때
            {
                sqlstr += " AND BUSN_NO = '" + dr["USER_PW"] + "' "; //사업자 번호 비교
            }



            return sqlstr;
        }

        public string UpdateUserPw(DataRow dr)
        {
            sqlstr = "";

            sqlstr += "UPDATE ELVISBILL.EVB_MEMB_SET  SET";
            sqlstr += " USER_PW = ELVISBILL.UNF_MD5_ENCRYPTION(('"+dr["UPD_PW"] +"')) "; // 실제 반영
            //sqlstr += " USER_PW = '" + dr["UPD_PW"] + "' "; // 실제 반영
            sqlstr += "WHERE 1=1 ";
            sqlstr += " AND USER_ID = UPPER('"+dr["USER_ID"]+"') ";
            sqlstr += " AND BUSN_NO = '"+dr["BUSN_NO"] +"' ";


            return sqlstr;
        }

    }
}
