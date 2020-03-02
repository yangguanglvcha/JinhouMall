DEFINE CLASS ctl_region as Session
	PROCEDURE getpro
		 oDbHelper = Newobject("MsSqlHelper","MsSqlHelper.prg")
	        TEXT TO lcSqlCmd NOSHOW TEXTMERGE PRETEXT 1+2
	            SELECT id,name FROM region WHERE   leveltype = '1'
	        ENDTEXT 
		 nRow = oDbHelper.SqlQuery(lcSqlCmd,"region")
		 
	        IF nRow<0
	            ERROR oDbHelper.errmsg
	        ENDIF 


	        Return cursortojson("region")
 
	ENDPROC
	
	
	PROCEDURE getcity		  
	        cAreaQuery = HttpQueryParams("areaquery")	        
	        ctj = ""		
		
	        **前端通过store.reload时，会重新调用后台的getlist2方法	        
	        If (!EMPTY(cAreaQuery))
	        	TEXT TO ctj NOSHOW TEXTMERGE PRETEXT 1+2
	                  SELECT  id,name FROM  region WHERE  parentId ='<<cAreaQuery>>'
	        	ENDTEXT
	        ENDIF	      
	    
	        oDbHelper = Newobject("MsSqlHelper","MsSqlHelper.prg")
	        nRow = oDbHelper.SqlQuery(ctj,"region")
	         IF nRow<0
	            ERROR oDbHelper.errmsg
	        ENDIF 
	        Return cursortojson("region")
	ENDPROC
	
	PROCEDURE gettown		  
	        cAreaQuery = HttpQueryParams("query")	        
	        ctj = ""		
		
	        **前端通过store.reload时，会重新调用后台的getlist2方法	        
	        If (!EMPTY(cAreaQuery))
	        	TEXT TO ctj NOSHOW TEXTMERGE PRETEXT 1+2
	                  SELECT  id,name,MergerName FROM  region WHERE  parentId ='<<cAreaQuery>>'
	        	ENDTEXT
	        ENDIF
	     *   ?ctj	        

	        oDbHelper = Newobject("MsSqlHelper","MsSqlHelper.prg")
	        nRow = oDbHelper.SqlQuery(ctj,"region")
	         IF nRow<0
	            ERROR oDbHelper.errmsg
	        ENDIF 
	        Return cursortojson("region")
	ENDPROC
	
	PROCEDURE getaddress	
		 cJson = HttpGetPostData()	  
		 oJson = foxjson_parse(cJson)
		 cid = oJson.item("id")
	        ctj = ""		
		
	        **前端通过store.reload时，会重新调用后台的getlist2方法	        
	        	TEXT TO ctj NOSHOW TEXTMERGE PRETEXT 1+2
	                  SELECT  MergerName FROM  region WHERE  Id ='<<cid>>'
	        	ENDTEXT
	        ?ctj	        

	        oDbHelper = Newobject("MsSqlHelper","MsSqlHelper.prg")
	        nRow = oDbHelper.SqlQuery(ctj,"region")
	         IF nRow<0
	            ERROR oDbHelper.errmsg
	        ENDIF 
	        Return cursortojson("region")
	endpro

enddef