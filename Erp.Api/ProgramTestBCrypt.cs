using System;
using BCrypt.Net;

class ProgramTestBCrypt
{
    static void Main()
    {
        string hash = "$2a$06$srF3e0A2XlstDHs1UV7fv.eLokrDackLXYWM2HDQ6Z4rgIhKIC05y";
        bool verified = BCrypt.Net.BCrypt.Verify("12345", hash);
        Console.WriteLine("Şifre doğrulandı mı? " + verified);
    }
}
