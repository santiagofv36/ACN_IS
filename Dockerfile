# Use the appropriate .NET SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
EXPOSE 80

# Install Node.js/npm
RUN apt-get update && apt-get install -y nodejs npm

# Copy the .csproj and restore any dependencies
COPY *.sln .
COPY ./*.csproj ./
RUN dotnet restore

# Copy the remaining source code and build the application
COPY . .
RUN dotnet build -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/mssql/server:2019-latest AS sqlserver
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=YourStrong!Passw0rd

# Database setup script
COPY init.sql /docker-entrypoint-initdb.d/

# Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReactVentas.dll"]