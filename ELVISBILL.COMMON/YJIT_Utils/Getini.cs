using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.Data;
using System.Runtime.InteropServices;   //class 추가
using System.Web;

namespace ELVISBILL.COMMON.YJIT_Utils
{
    public class Getini
    {
        [DllImport("kernel32")]
        private static extern long WritePrivateProfileString(string section, string key, string val, string filePath);
        [DllImport("kernel32")]
        private static extern int GetPrivateProfileString(string section, string key, string def, StringBuilder retVal,
                                                        int size, string filePath);

        /// <summary>
        /// INI에 있는 데이터를 가지고 오기
        /// </summary>
        /// <param name="strSection"></param>
        /// <param name="strKey"></param>
        /// <returns></returns>
        public string fnGetini(string strSection, string strKey)
        {
            string StrReturn = "";

            //ini 쓰기
            //WritePrivateProfileString("DB", "DEMO", "1234", @"D:\\DB.ini");
            //WritePrivateProfileString("DB", "memberKey", "4321", @"D:\\DB.ini");

            StringBuilder KeyValue = new StringBuilder(255);

            string StrIniPath = HttpContext.Current.Server.MapPath("/DB.ini");

            //ini 읽기
            GetPrivateProfileString(strSection, strKey, "(NONE)", KeyValue, 255, StrIniPath);
            StrReturn = KeyValue.ToString();

            //string StrPath1 = Environment.CurrentDirectory; //C:\Program Files (x86)\IIS Express
            //string StrPath2 = System.IO.Directory.GetParent(System.Environment.CurrentDirectory).Parent.FullName; //C:\
            //string StrPath3 = Environment.SystemDirectory; //C:\WINDOWS\system32             
            //string StrPath4 = HttpContext.Current.Server.MapPath("");

            return StrReturn;
        }
    }
}
