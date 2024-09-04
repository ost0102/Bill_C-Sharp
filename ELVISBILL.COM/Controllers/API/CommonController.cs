using System;
using System.Drawing;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Runtime.InteropServices;
using System.ComponentModel;
using System.Security.Principal;

namespace ELVISBILL.COM.Controllers.API
{
    /// <summary>
    /// 로그온 타입
    /// </summary>
    public enum LogonType
    {
        LOGON32_LOGON_INTERACTIVE = 2,
        LOGON32_LOGON_NETWORK = 3,
        LOGON32_LOGON_BATCH = 4,
        LOGON32_LOGON_SERVICE = 5,
        LOGON32_LOGON_UNLOCK = 7,
        LOGON32_LOGON_NETWORK_CLEARTEXT = 8,
        LOGON32_LOGON_NEW_CREDENTIALS = 9
    }

    /// <summary>
    /// 로그온 제공자
    /// </summary>
    public enum LogonProvider
    {
        LOGON32_PROVIDER_DEFAULT = 0,
        LOGON32_PROVIDER_WINNT35 = 1,
        LOGON32_PROVIDER_WINNT40 = 2,
        LOGON32_PROVIDER_WINNT50 = 3
    }

    public class WndLogin
    {
        /// <summary>
        /// 로그온
        /// </summary>
        /// <param name="lpszUsername">사용자 계정</param>
        /// <param name="lpszDomain">도메인</param>
        /// <param name="lpszPassword">암호</param>
        /// <param name="dwLogonType">로그온 조류</param>
        /// <param name="dwLogonProvider">로그온 프로바이더</param>
        /// <param name="phToken">엑세스 토큰</param>
        /// <returns></returns>
        [DllImport("advapi32.dll", EntryPoint = "LogonUser", SetLastError = true)]
        private static extern bool _LogonUser(string lpszUsername, string lpszDomain, string lpszPassword,
            int dwLogonType, int dwLogonProvider, out int phToken);

        /// <summary>
        /// 주어진 사용자 ID로 로그온하고 액세스 토큰을 반환
        /// </summary>
        /// <param name="userName">사용자 계정</param>
        /// <param name="password">암호</param>
        /// <param name="domainName">도메인 이름</param>
        /// <param name="logonType">로그온 종류</param>
        /// <param name="logonProvider">로그온 프로바이더</param>
        /// <returns>엑세스 토큰</returns>
        public static IntPtr LogonUser(string userName, string password, string domainName,
            LogonType logonType, LogonProvider logonProvider)
        {
            int token = 0;
            bool logonSuccess = _LogonUser(userName, domainName, password,
                (int)logonType, (int)logonProvider, out token);

            if (logonSuccess)
                return new IntPtr(token);

            int retval = Marshal.GetLastWin32Error();
            throw new Win32Exception(retval);
        }
    }
}
