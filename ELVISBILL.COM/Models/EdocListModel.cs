using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ELVISBILL.Models
{
    public class EdocListModel
    {
        public string ContentType { get; set; } // 공급자(S)  /   default : 공급받는자(B)

        public string SearchType { get; set; } // 번호기준(N) / 담당자(S) / 이메일(E)

        public string CRN_NO { get; set; } // 사업자번호

        public string N_Value { get; set; } // 번호기준 : B/L No or Invoice No or 계산서 번호

        public string Email { get; set; } // 담당자 : Email

        public string Isinit { get; set; } // 담당자 : Email
    }
}
