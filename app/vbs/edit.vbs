
Dim oWord, oDocument, oExcel, oWorkbook, oPPT, oPresentation, FileClosed
FileClosed = False

Dim filename

filename = Wscript.Arguments.Item(0)
Edit(filename)

Sub Edit(filename)

    ' Create a File System object
    Set objFSO = CreateObject( "Scripting.FileSystemObject" )

    ' Check if the Word document exists
    If objFSO.FileExists( filename ) Then
        Set objFile = objFSO.GetFile( filename )
        strFile = objFile.Path
    Else
        WScript.Echo "The file does not exist" & vbCrLf
        ' Close Word
        WScript.Quit(404)
        Exit Sub
    End If

    ' strExt = Right(strFile, 5)
    strExt = objFSO.GetExtensionName(strFile)

    If strExt = "docx" or strExt = "doc" then
        WScript.Echo FileClosed & vbCrLf
        EditDocument(strFile)
    ElseIf strExt = "xlsx" or strExt = "xls" then
        WScript.Echo FileClosed & vbCrLf
        EditWorkbook(strFile)
    ElseIf strExt = "pptx" or strExt = "ppt" then
        WScript.Echo FileClosed & vbCrLf
        EditPresentation(strFile)
    Else
        FileClosed = True
    End If

End Sub  

Sub EditDocument( strFile )

    ' Create a Word object
    Set oWord = WScript.CreateObject( "Word.Application", "oWord_" )

    With oWord
        ' True: make Word visible; False: invisible
        .Visible = true

        ' Open the Word document
        .Documents.Open strFile

        ' Make the opened file the active document
        Set oDocument = .ActiveDocument
        WScript.ConnectObject oDocument, "oDocument_"

    End With

End Sub

Sub oDocument_Close()
    oDocument.Save()
    FileClosed = True
End Sub

Sub EditWorkbook( strFile )
    
    ' Create a excel object
    Set oExcel = WScript.CreateObject( "Excel.Application", "oExcel_" )

    With oExcel
        ' True: make Excel visible; False: invisible
        .Visible = True

        ' Open the excel document
        .Workbooks.Open strFile

        ' Make the opened file the active document
        Set oWorkbook = .ActiveWorkbook
        WScript.ConnectObject oWorkbook, "oWorkbook_"

    End With

End Sub

Sub oWorkbook_Close()
    oWorkbook.Save()
    FileClosed = True
End Sub

Sub EditPresentation( strFile )

    ' FileClosed = False
    ' Create a ppt object
    Set oPPT = WScript.CreateObject( "PowerPoint.Application", "oPPT_" )

    With oPPT
        ' True: make ppt visible; False: invisible
        .Visible = True

        ' Open the ppt document
        .Presentations.Open strFile

        ' Make the opened file the active document
        Set oPresentation = .ActivePresentation
        WScript.ConnectObject oPresentation, "oPresentation_"

    End With

End Sub

Sub oPresentation_Close()
    oPresentation.Save()
    FileClosed = True
End Sub

Do Until FileClosed
    WScript.sleep 1000
Loop