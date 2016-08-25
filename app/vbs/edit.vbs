
Dim oWord, oDocument, FileClosed
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

    strExt = Right(strFile, 5)

    If strExt = ".docx" or strExt = ".doc" then
        EditDocument(strFile)
    ElseIf strExt = ".xlsx" or strExt = ".xls" then
        EditWorkbook(strFile)
    Else
        FileClosed = True
    End If

End Sub  

Sub EditDocument( strFile )

    ' Create a Word object
    Set oWord = WScript.CreateObject( "Word.Application", "oWord_" )

    With oWord
        ' True: make Word visible; False: invisible
        .Visible = True

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
    WScript.Echo strFile & vbCrLf
    FileClosed = True
End Sub

Do Until FileClosed
    WScript.sleep 1000
Loop