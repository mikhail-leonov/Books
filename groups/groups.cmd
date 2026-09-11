@echo off
cd /d "%~dp0"
:: ================================================
:: ===         Build Group sql files            ===
:: ================================================
node groups.js

:: ================================================
:: ===          Copy Group sql files            ===
:: ================================================
copy "groups\Harry Potter.sql"  "..\src\sql\groups\Harry Potter.sql" 
copy "groups\EVE Online.sql"    "..\src\sql\groups\EVE Online.sql" 
copy "groups\Popadanec.sql"     "..\src\sql\groups\Popadanec.sql" 
copy "groups\Erotica.sql"       "..\src\sql\groups\Erotica.sql" 
