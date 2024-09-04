using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Web;
using System.IO;
using System.Security.Cryptography;

namespace ELVISBILL.COMMON.YJIT_Utils
{
    public class Encryption
    {
        //readOnlyKey = 135792468101234567891024681013579
        private static readonly string KEY = "yjit2020prime135792468101234567891024681013579";
        private static readonly string KEY_128 = KEY.Substring(0, 128 / 8);
        private static readonly string KEY_256 = KEY.Substring(0, 256 / 8);

        #region // 암호화 섹션
        /// <summary>
        /// AES 128 암호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="rtnStr">plain String</param>
        /// <returns>암호화 string</returns>
        public string encryptAES128(string rtnStr)
        {
            try
            {
                byte[] strBytes = Encoding.UTF8.GetBytes(rtnStr);

                RijndaelManaged rm = new RijndaelManaged();
                rm.Mode = CipherMode.CBC;
                rm.Padding = PaddingMode.PKCS7;
                rm.KeySize = 128;

                MemoryStream ms = new MemoryStream();
                ICryptoTransform encryptor = rm.CreateEncryptor(Encoding.UTF8.GetBytes(KEY_128), Encoding.UTF8.GetBytes(KEY_128));
                CryptoStream cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
                cryptoStream.Write(strBytes, 0, strBytes.Length);
                cryptoStream.FlushFinalBlock();

                byte[] encryptBytes = ms.ToArray();
                string encryptString = Convert.ToBase64String(encryptBytes);

                cryptoStream.Close();
                ms.Close();
                return encryptString;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        ///  AES 128 복호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="encrypt">암호화String</param>
        /// <returns>복호화 string</returns>
        public string decryptAES128(string encrypt)
        {
            try
            {
                byte[] encryptBytes = Convert.FromBase64String(encrypt);
                RijndaelManaged rm = new RijndaelManaged();
                rm.Mode = CipherMode.CBC;
                rm.Padding = PaddingMode.PKCS7;
                rm.KeySize = 128;

                MemoryStream ms = new MemoryStream(encryptBytes);
                ICryptoTransform decryptor = rm.CreateDecryptor(Encoding.UTF8.GetBytes(KEY_128), Encoding.UTF8.GetBytes(KEY_128));
                CryptoStream cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);

                byte[] rtnStrBytes = new byte[encryptBytes.Length];
                int rtnStrCount = cryptoStream.Read(rtnStrBytes, 0, rtnStrBytes.Length);
                string rtnStr = Encoding.UTF8.GetString(rtnStrBytes, 0, rtnStrCount);

                cryptoStream.Close();
                ms.Close();

                return rtnStr;

            }
            catch (Exception)
            {
                return null;
            }

        }

        /// <summary>
        /// AES 256 암호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="rtnStr"></param>
        /// <returns></returns>
        public string encryptAES256(string rtnStr)
        {
            try
            {
                byte[] rtnStrBytes = Encoding.UTF8.GetBytes(rtnStr);
                RijndaelManaged rm = new RijndaelManaged();
                rm.Mode = CipherMode.CBC;
                rm.Padding = PaddingMode.PKCS7;
                rm.KeySize = 256;

                MemoryStream ms = new MemoryStream();
                ICryptoTransform encryptor = rm.CreateEncryptor(Encoding.UTF8.GetBytes(KEY_256), Encoding.UTF8.GetBytes(KEY_128));
                CryptoStream cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
                cryptoStream.Write(rtnStrBytes, 0, rtnStrBytes.Length);
                cryptoStream.FlushFinalBlock();

                byte[] encryptBytes = ms.ToArray();
                string encryptString = Convert.ToBase64String(encryptBytes);

                cryptoStream.Close();
                ms.Close();

                return encryptString;

            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// AES 256 복호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="encrypt">string</param>
        /// <returns></returns>
        public string decryptAES256(string encrypt)
        {
            try
            {
                byte[] encryptBytes = Convert.FromBase64String(encrypt);
                RijndaelManaged rm = new RijndaelManaged();
                rm.Mode = CipherMode.CBC;
                rm.Padding = PaddingMode.PKCS7;
                rm.KeySize = 256;




                MemoryStream ms = new MemoryStream(encryptBytes);
                ICryptoTransform decryptor = rm.CreateDecryptor(Encoding.UTF8.GetBytes(KEY_256), Encoding.UTF8.GetBytes(KEY_128));
                CryptoStream cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);

                byte[] rtnStrBytes = new byte[encryptBytes.Length];
                int rtnStrCount = cryptoStream.Read(rtnStrBytes, 0, rtnStrBytes.Length);
                string rtnStr = Encoding.UTF8.GetString(rtnStrBytes, 0, rtnStrCount);
                cryptoStream.Close();
                ms.Close();

                return rtnStr;

            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// AES 256 복호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="encrypt_Dt">Datatable</param>
        /// <returns></returns>
        public string decryptAES256(DataTable encrypt_Dt)
        {
            try
            {
                string rtnStr = "";
                string encrypt = "";

                if (encrypt_Dt.Rows.Count > 0)
                {
                    encrypt = encrypt_Dt.Rows[0][0].ToString();
                    byte[] encryptBytes = Convert.FromBase64String(encrypt);
                    RijndaelManaged rm = new RijndaelManaged();
                    rm.Mode = CipherMode.CBC;
                    rm.Padding = PaddingMode.PKCS7;
                    rm.KeySize = 256;

                    MemoryStream ms = new MemoryStream(encryptBytes);
                    ICryptoTransform decryptor = rm.CreateDecryptor(Encoding.UTF8.GetBytes(KEY_256), Encoding.UTF8.GetBytes(KEY_128));
                    CryptoStream cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);

                    byte[] rtnStrBytes = new byte[encryptBytes.Length];
                    int rtnStrCount = cryptoStream.Read(rtnStrBytes, 0, rtnStrBytes.Length);
                    rtnStr = Encoding.UTF8.GetString(rtnStrBytes, 0, rtnStrCount);
                    cryptoStream.Close();
                    ms.Close();
                }
                return rtnStr;

            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion
    }
}
