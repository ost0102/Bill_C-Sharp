using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Configuration;
using Oracle.ManagedDataAccess;
using Oracle.ManagedDataAccess.Client;

namespace ELVISPRIME.DATA
{
    public static class DataHelper
    {
        private static string _connectionString;
        private static string _connectionString_Select;
        private static object _connectionStringLockObject = new object();
        private static string _ConnectionEtcString;

        public static string ConnectionString
        {
            get
            {
                if (string.IsNullOrEmpty(_connectionString))
                {
                    lock (_connectionStringLockObject)
                    {
                        _connectionString = ConfigurationManager.ConnectionStrings["DEMO"].ConnectionString;
                    }
                }

                return _connectionString;
            }
        }

        public static string ConnectionString_Select
        {
            set
            {
                if (value == "CRM")
                {
                    lock (_connectionStringLockObject)
                    {
                        _connectionString = ConfigurationManager.ConnectionStrings["CRM"].ConnectionString;
                    }
                }
                else if (value == "BILL")
                {
                    lock (_connectionStringLockObject)
                    {
                        _connectionString = ConfigurationManager.ConnectionStrings["BILL"].ConnectionString;
                    }
                }
                else
                {
                    lock (_connectionStringLockObject)
                    {
                        _connectionString = ConfigurationManager.ConnectionStrings["BILL"].ConnectionString;
                    }
                }
            }
        }

        #region "ODP.NET 이용 관련"

        /// <summary>
        /// Insert Query 전용
        /// </summary>
        /// <param name="Sql"></param>
        /// <param name="cmdType"></param>
        /// <returns></returns>
        public static int ExecuteNonQuery(string Sql, CommandType cmdType)
        {
            int result;

            using (OracleConnection conn = new OracleConnection(ConnectionString))
            {
                try
                {
                    conn.Open();
                    OracleCommand cmd = new OracleCommand(Sql, conn);
                    cmd.CommandType = cmdType;

                    result = cmd.ExecuteNonQuery();

                    conn.Close();
                }
                catch (Exception)
                {
                    if (conn.State != ConnectionState.Closed)
                    {
                        conn.Close();
                    }
                    throw;
                }
            }

            return result;
        }

        

        public static object ExecuteScalar(string Sql, CommandType cmdType)
        {
            object result = null;

            using (OracleConnection conn = new OracleConnection(ConnectionString))
            {
                try
                {
                    conn.Open();

                    OracleCommand cmd = new OracleCommand(Sql, conn);
                    cmd.CommandType = cmdType;

                    result = cmd.ExecuteScalar();

                    conn.Close();
                }
                catch (Exception)
                {
                    if (conn.State != ConnectionState.Closed)
                        conn.Close();

                    throw;
                }
            }

            return result;
        }


        public static DataSet ExecuteDataSet(string Sql, CommandType cmdType)
        {
            DataSet dsResult = null;

            using (OracleConnection conn = new OracleConnection(ConnectionString))
            {
                try
                {
                    conn.Open();
                    OracleCommand cmd = new OracleCommand(Sql, conn);

                    OracleDataAdapter da = new OracleDataAdapter(cmd);
                    dsResult = new DataSet();
                    da.Fill(dsResult);
                    da.Dispose();
                    conn.Close();

                }
                catch (Exception)
                {
                    if (conn.State != ConnectionState.Closed)
                    {
                        conn.Close();
                    }
                    throw;
                }
            }

            return dsResult;
        }


        public static DataTable ExecuteDataTable(string Sql, CommandType cmdType)
        {
            DataTable dtResult = null;

            using (OracleConnection conn = new OracleConnection(ConnectionString))
            {
                try
                {
                    conn.Open();

                    OracleCommand cmd = new OracleCommand(Sql, conn);
                    cmd.CommandType = cmdType;

                    dtResult = new DataTable();

                    OracleDataAdapter da = new OracleDataAdapter(cmd);
                    da.Fill(dtResult);
                    da.Dispose();
                    conn.Close();
                }
                catch (Exception)
                {
                    if (conn.State != ConnectionState.Closed)
                    {
                        conn.Close();
                    }
                    throw;
                }
            }

            return dtResult;
        }


        public static OracleDataReader ExecuteDataReader(string Sql, CommandType cmdType)
        {
            OracleDataReader rs = null;
            OracleConnection conn = null;

            try
            {
                conn = new OracleConnection(ConnectionString);
                conn.Open();

                OracleCommand cmd = new OracleCommand(Sql, conn);
                cmd.CommandType = cmdType;
                rs = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch (Exception)
            {
                if (rs != null)
                {
                    rs.Close();
                }

                if (conn != null && conn.State != ConnectionState.Closed)
                {
                    conn.Close();
                }

                throw;
            }

            return rs;
        }

        #endregion // ADO.NET 끝
    }
}
