; NSIS packaging/install script
; Docs: http://nsis.sourceforge.net/Docs/Contents.html
; SimpChinese.nlf:/desktop/resources/windows

!include LogicLib.nsh
!include nsDialogs.nsh

;判断系统
!include WinVer.nsh

; --------------------------------
; Variables
; --------------------------------

; First is default
LoadLanguageFile "${NSISDIR}\Contrib\Language files\English.nlf"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\SimpChinese.nlf"

; Set name using the normal interface (Name command)
LangString Name ${LANG_ENGLISH} "Steedos Desktop"
LangString Name ${LANG_SIMPCHINESE} "华炎云"

!define dest "{{dest}}"
!define src "{{src}}"
!define productName $(Name)
!define name "{{name}}"
!define version "{{version}}"
!define icon "{{icon}}"
!define setupIcon "{{setupIcon}}"
!define banner "{{banner}}"

!define exec "{{name}}.exe"

!define regkey "Software\${productName}"
!define uninstkey "Software\Microsoft\Windows\CurrentVersion\Uninstall\${productName}"

!define uninstaller "uninstall.exe"

; --------------------------------
; Installation
; --------------------------------

Unicode true
SetCompressor /SOLID lzma

Name $(Name)
Icon "${setupIcon}"
OutFile "${dest}"
InstallDir "$PROGRAMFILES\${productName}"
InstallDirRegKey HKLM "${regkey}" ""

RequestExecutionLevel admin
CRCCheck on
SilentInstall normal

XPStyle on
ShowInstDetails nevershow
AutoCloseWindow false
WindowIcon off

; A multilingual message
LangString Message_welcome ${LANG_ENGLISH} "Welcome to ${productName} version ${version} installer."
LangString Message_welcome ${LANG_SIMPCHINESE} "欢迎安装${productName}${version}"

LangString Message_setup ${LANG_ENGLISH} "${productName} setup"
LangString Message_setup ${LANG_SIMPCHINESE} "安装${productName}"

LangString Message_click ${LANG_ENGLISH} "Click install to begin."
LangString Message_click ${LANG_SIMPCHINESE} "点击“安装”，开始。"

LangString Message_uninstall ${LANG_ENGLISH} "uninstall ${productName}"
LangString Message_uninstall ${LANG_SIMPCHINESE} "卸载${productName}"

LangString Message_remove ${LANG_ENGLISH} "Remove also my Steedos Desktop personal data"
LangString Message_remove ${LANG_SIMPCHINESE} "同时移除本机上的相关数据"

LangString Message_waring ${LANG_ENGLISH} "If you really want to remove Steedos Desktop from your computer press uninstall button."
LangString Message_waring ${LANG_SIMPCHINESE} "如果您确定要卸载“${productName}”，请点击“解除安装”按钮。"

LangString Message_question ${LANG_ENGLISH} "Don't like ${productName} anymore? Hit uninstall button."
LangString Message_question ${LANG_SIMPCHINESE} "不再需要“${productName}”了吗？点击“解除安装”按钮。"

LangString Message_alert ${LANG_ENGLISH} "Win7 and above required"
LangString Message_alert ${LANG_SIMPCHINESE} "对不起，华炎云不支持windows xp和windows vista操作系统，请使用chrome浏览器登录华炎云。"

Caption $(Message_setup)
; Don't add sub-captions to title bar
SubCaption 3 " "
SubCaption 4 " "

Page custom welcome
Page instfiles

Var Image
Var ImageHandle

Function .onInit
    
    ;判断系统（仅支持win7及win7以上系统）
    ${IfNot} ${AtLeastWin7}
        MessageBox MB_OK $(Message_alert)
        Quit
    ${EndIf}

    ; Extract banner image for welcome page
    InitPluginsDir
    ReserveFile "${banner}"
    File /oname=$PLUGINSDIR\banner.bmp "${banner}"

FunctionEnd

; Custom welcome page
Function welcome

    nsDialogs::Create 1018

    ${NSD_CreateLabel} 185 1u 210 100% $(Message_welcome)$\r$\n$\r$\n$(Message_click)

    ${NSD_CreateBitmap} 0 0 170 210 ""
    Pop $Image
    ${NSD_SetImage} $Image $PLUGINSDIR\banner.bmp $ImageHandle

    nsDialogs::Show

    ${NSD_FreeImage} $ImageHandle

FunctionEnd

; Installation declarations
Section "Install"

    WriteRegStr HKLM "${regkey}" "Install_Dir" "$INSTDIR"
    WriteRegStr HKLM "${uninstkey}" "DisplayName" "${productName}"
    WriteRegStr HKLM "${uninstkey}" "DisplayIcon" '"$INSTDIR\icon.ico"'
    WriteRegStr HKLM "${uninstkey}" "UninstallString" '"$INSTDIR\${uninstaller}"'

    ; Remove all application files copied by previous installation
    RMDir /r "$INSTDIR"
    RMDir /r "$DESKTOP\${productName}.lnk"
    RMDir /r "$SMSTARTUP\${productName}.lnk"
    
    SetOutPath $INSTDIR

    ; Include all files from /build directory
    File /r "${src}\*"

    ; Create start menu shortcut
    CreateShortCut "$SMPROGRAMS\${productName}.lnk" "$INSTDIR\${exec}" "" "$INSTDIR\icon.ico"
    CreateShortCut "$DESKTOP\${productName}.lnk" "$INSTDIR\${exec}" "" "$INSTDIR\icon.ico"
    
    ; 开机自启
    CreateShortCut "$SMSTARTUP\${productName}.lnk" "$INSTDIR\${exec}" "" "$INSTDIR\icon.ico"
    
    WriteUninstaller "${uninstaller}"

SectionEnd

; --------------------------------
; Uninstaller
; --------------------------------

ShowUninstDetails nevershow

UninstallCaption $(Message_uninstall)
UninstallText $(Message_question)
UninstallIcon "${icon}"

UninstPage custom un.confirm un.confirmOnLeave
UninstPage instfiles

Var RemoveAppDataCheckbox
Var RemoveAppDataCheckbox_State

; Custom uninstall confirm page
Function un.confirm

    nsDialogs::Create 1018

    ${NSD_CreateLabel} 1u 1u 100% 24u $(Message_waring)

    ${NSD_CreateCheckbox} 1u 35u 100% 10u $(Message_remove)
    Pop $RemoveAppDataCheckbox

    nsDialogs::Show

FunctionEnd

Function un.confirmOnLeave

    ; Save checkbox state on page leave
    ${NSD_GetState} $RemoveAppDataCheckbox $RemoveAppDataCheckbox_State

FunctionEnd

; Uninstall declarations
Section "Uninstall"

    DeleteRegKey HKLM "${uninstkey}"
    DeleteRegKey HKLM "${regkey}"

    Delete "$SMPROGRAMS\${productName}.lnk"
    Delete "$DESKTOP\${productName}.lnk"
    Delete "$SMSTARTUP\${productName}.lnk"
    
    ; Remove whole directory from Program Files
    RMDir /r "$INSTDIR"

    ; Remove also appData directory generated by your app if user checked this option
    ${If} $RemoveAppDataCheckbox_State == ${BST_CHECKED}
        RMDir /r "$APPDATA\${productName}"
    ${EndIf}

SectionEnd
