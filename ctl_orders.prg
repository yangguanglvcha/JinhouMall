Define Class ctl_orders As ctl_public_sync_right Of ctl_public_sync_right.prg
    **添加两个自定义属性
     dal_orders = .F.
     dal_orderdetail = .F.
    

    Procedure Init
        DoDefault()
        This.dal_orders = Newobject("dal_orders","dal_orders.prg","",This.Datasource)               
        This.dal_orderdetail = Newobject("dal_orderdetail","dal_orderdetail.prg","",This.Datasource)    
    ENDPROC
    
    
    PROCEDURE getuser
	  Local lcPostData,oJson
        lcPostData = HttpGetPostData()
        oJson = foxjson_parse(lcPostData)
    	  cno = oJson.item("userno")
     	  cpwd = oJson.item("userpwd")
     	  
   	  TEXT TO lcSqlCmd NOSHOW textmerge
            SELECT username,password,departname,usertel FROM sellusers WHERE userno='<<cno>>' AND  password =  '<<cpwd>>'
        ENDTEXT
        *?lcsqlcmd
        
        **创建MsSqlHelper实例，并执行sql语句
        oDbHelper = NEWOBJECT("MsSqlHelper","MsSqlHelper.prg")
        IF oDbHelper.SqlQuery(lcSqlCmd,'sellusers') <0
            ERROR oDbHelper.errmsg
        ENDIF       

*!*	        TEXT TO cReturn NOSHOW TEXTMERGE PRETEXT 1+2
*!*		        {"errno":0,"errmsg":"OK","success":true}
*!*	        ENDTEXT
        Return cursortojson("sellusers")
    endproc
    
    
    PROCEDURE getdetail
        Private ctj      
        cquery = HttpQueryParams("orderno")
        ?'cquery',cquery
        ctj = ""
        
 

        **前端通过store.reload时，会重新调用后台的getlist2方法
*!*	        If (!Empty(cQuery))
*!*	            TEXT TO ctj NOSHOW TEXTMERGE PRETEXT 1+2
*!*		              sname like '%<<cQuery>>%' and
*!*	            ENDTEXT
*!*	            nPage = 1
*!*	        Endif
      
     TEXT TO ctj NOSHOW TEXTMERGE PRETEXT 1+2
	              SELECT * FROM orderdetail WHERE orderno = '<<cquery>>'
            ENDTEXT

        oDbHelper = Newobject("MsSqlHelper","MsSqlHelper.prg")
        oDbHelper.SqlQuery(ctj,"ordertail")
        *nRow = oDbHelper.SqlSelectPage("cjxx",ctj,nPage,nLimit,"cjxx")

        *2019.9.9改用dal_ca，所以用以下语句（9.9前用上面语句）
        *nRow = oDbHelper.SqlSelectPage("View_hhxx",ctj,nPage,nLimit,"View_hhxx")

        *以下语句根本不需要，只是因为原来把area写为了aera,所以找不到area，导致分页不成功
        *oDbHelper.sqlquery("SELECT * FROM orderdetail","ordertail")

        Return cursorToJson("ordertail")
    
    
    endproc
    
    
    
	PROCEDURE save
		
        Local lcPostData,oJson
        lcPostData = HttpGetPostData()
       * _cliptext=lcPostData
        *?lcpostdata
        *oJson = Createobject("foxjson")
        cno = HttpQueryParams("userno")
        cname = HttpQueryParams("username")
        cpwd = HttpQueryParams("newpwd")
        cdepart = HttpQueryParams("departname")
        ctel = HttpQueryParams("usertel")

        
*!*	         cno = oJson.item("userno")
*!*		   cname = oJson.item("username")
*!*		   cpwd = oJson.item("newpwd")
*!*		   cdepart = oJson.item("departname")
*!*		   ctel = oJson.item("usertel")
	*?cname,cdepart,ctel
        **构建更新的sql语句
        TEXT TO lcSqlCmd NOSHOW textmerge
            INSERT INTO sellusers (userno,username,password,departname,usertel) VALUES  ('<<cno>>','<<cname>>','<<cpwd>>','<<cdepart>>','<<ctel>>')
        ENDTEXT
       * ?lcsqlcmd
        
        **创建MsSqlHelper实例，并执行sql语句
        oDbHelper = NEWOBJECT("MsSqlHelper","MsSqlHelper.prg")
        IF oDbHelper.SqlQuery(lcSqlCmd,'sellusers') <0
            ERROR oDbHelper.errmsg
        ENDIF       


        *userno=jh6701&username=%E7%9A%84%E7%9A%84&newpwd=111&conpwd=111&departname=%E5%8A%9E%E5%85%AC%E5%AE%A4&usertel=13061178181

        TEXT TO cReturn NOSHOW TEXTMERGE PRETEXT 1+2
	        {"errno":0,"errmsg":"OK","success":true}
        ENDTEXT
        Return cReturn
	
	ENDPROC
	
	
	***保存订单明细
	PROCEDURE saveorders
        Local lcPostData,oJson
        lcPostData = HttpGetPostData()    
        oJson = Createobject("foxjson")

        oJson.parse(lcPostData)

        x1 = oJson.Item("data").tostring()
        x2 = oJson.Item("rows").tostring()
        ?'主表:',x1
        ?''
        ?'从表:',x2
        **解析成表，生成游标
        This.dal_orders.parseJson(x1,"",0)        
        this.dal_orderdetail.ParseJson(x2,"",0)
        **调用SaveDatabase，自动拥有事务管理
        If !This.SaveDatabase()
            Error This.msg
        Endif
        Local cReturn
        TEXT TO cReturn NOSHOW TEXTMERGE PRETEXT 1+2
	        {"errno":0,"errmsg":"OK","success":true}
        ENDTEXT
        Return cReturn
    ENDPROC	
	

    Procedure DoSave
        llReturn = .T.
        If !This.dal_orders.Save()
            Error "无法保存"+Transform(This.dal_orders.msg)
        ENDIF
        If !This.dal_orderdetail.Save()
            Error "无法保存"+Transform(This.dal_orderdetail.msg)
        Endif
        
        Return llReturn
    Endproc	
	

enddefin