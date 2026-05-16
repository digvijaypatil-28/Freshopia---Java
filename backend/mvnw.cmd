@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

@REM Execute a user defined script before this one
if not "%MAVEN_SKIP_RC%"=="" goto skipRcPre
if exist "%PROGRAMDATA%\mavenrc.cmd" call "%PROGRAMDATA%\mavenrc.cmd" %*
if exist "%USERPROFILE%\mavenrc.cmd" call "%USERPROFILE%\mavenrc.cmd" %*
:skipRcPre

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set "MAVEN_PROJECTBASEDIR=%CD%"
set "MAVEN_WPR_CONFIG=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"
:findBaseDir
if exist "%MAVEN_PROJECTBASEDIR%\.mvn" goto baseDirFound
set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\.."
if "%MAVEN_PROJECTBASEDIR%"=="%MAVEN_PROJECTBASEDIR%\.." goto baseDirFound
goto findBaseDir
:baseDirFound

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

set "MAVEN_CMD_LINE_ARGS=%*"

@REM Check if java is in PATH
where java >nul 2>&1
if %ERRORLEVEL% equ 0 goto javaFound

if not "%JAVA_HOME%"=="" goto javaHomeFound
echo.
echo Error: JAVA_HOME is not defined correctly.
echo   We cannot execute %JAVA_EXE%
echo.
set ERROR_CODE=1
goto end

:javaHomeFound
set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if exist "%JAVA_EXE%" goto execute

echo.
echo Error: JAVA_HOME is set to an invalid directory.
echo   JAVA_HOME = "%JAVA_HOME%"
echo   Please set the JAVA_HOME variable in your environment to match the
echo   location of your Java installation.
echo.
set ERROR_CODE=1
goto end

:javaFound
set "JAVA_EXE=java"

:execute
@REM Maven wrapper download logic simplified: assume it exists or use direct java call if we can't find wrapper jar
if exist "%WRAPPER_JAR%" goto runWrapper

@REM If wrapper jar doesn't exist, we'll try to run Maven directly if installed, or error out.
echo Maven Wrapper JAR not found. Please run 'mvn' directly if available.
set ERROR_CODE=1
goto end

:runWrapper
"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
if %ERRORLEVEL% neq 0 set ERROR_CODE=%ERRORLEVEL%

:end
@REM Pause the batch file if MAVEN_BATCH_PAUSE is set to 'on'
if "%MAVEN_BATCH_PAUSE%"=="on" pause

if not "%MAVEN_SKIP_RC%"=="" goto skipRcPost
if exist "%PROGRAMDATA%\mavenrc.cmd" call "%PROGRAMDATA%\mavenrc.cmd" %*
if exist "%USERPROFILE%\mavenrc.cmd" call "%USERPROFILE%\mavenrc.cmd" %*
:skipRcPost

exit /B %ERROR_CODE%
