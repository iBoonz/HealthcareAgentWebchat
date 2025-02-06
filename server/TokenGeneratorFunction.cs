using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using TokenGenerator;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace TokenGenerator
{
    public class TokenGeneratorFunction
    {
        private readonly ILogger<TokenGeneratorFunction> _logger;

        public TokenGeneratorFunction(ILogger<TokenGeneratorFunction> logger)
        {
            _logger = logger;
        }

        [Function("GenereratorFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Environment.GetEnvironmentVariable("   "));
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.PostAsync(Environment.GetEnvironmentVariable("DirectLineUri"), null);

                var token = GenerateToken(JsonConvert.DeserializeObject<DirectLinePayload>(await response.Content.ReadAsStringAsync()));
                return new OkObjectResult(token);
            }
        }

        private static string GenerateToken(DirectLinePayload payload, int expireMinutes = 200)
        {
            var symmetricKey = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("APP_SECRET"));
            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                        {
                        new Claim("userId", Guid.NewGuid().ToString()),
                        new Claim("userName", "you"),
                        new Claim("connectorToken",payload.token),
                    }),

                Expires = now.AddMinutes(Convert.ToInt32(expireMinutes)),

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(symmetricKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(stoken);

            return token;
        }
    }
}
