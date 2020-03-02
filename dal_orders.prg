Define Class Dal_orders As Qiyu_CursorAdapter Of Locfile('Qiyu_CursorAdapter.fxp')
    *--创建:祺佑工作室　日期:2020.03.02 http://www.tab163.com
	Alias = 'orders'
	WhereType =  1 && 1 关键字段 2 关键字段And可更新字段  3关键字段及其它已修改的字段 4 关键字段And时间戳
	KeyFieldList = "ID"	
	Tables = "orders"
	oDAL=.F.
	nRecno=0	
	uId=.f.
	uOldId=.f.
	DataSourceType="ODBC"
	BufferModeOverride= 5  && 3 开放式行缓冲 5开放式表缓冲
	isUpdateDelcmd=.t. &&执行DELETE方法后，是否立即更新后台数据库
	FetchSize=-1
	
	
	InsertCmdRefreshFieldList='ID'
	UpdateCmdRefreshFieldList='ID'
	InsertCmdRefreshCmd='SELECT ID FROM orders WHERE ID=@@IDENTITY'	
    PROCEDURE setupCA
    	Text to This.SelectCmd noshow
		SELECT ORDERNO,ORDERDATE,DEPARTNAME,SELLERNAME,SELLERTEL,RECEIVER,RECADDRESS,RECEIVERTEL,ORDERSTATE,ORDERTYPE,ORDERDESC,MANAGER,VALUELIST,ID FROM View_orders
		EndText
		Text to This.CursorSchema noshow
		 ORderno  C(20) , ORderdate D , DEpartname C(20) , SEllername C(20) , SEllertel C(12) , REceiver C(20) , REcaddress C(50) , REceivertel C(12) , ORderstate C(10) , ORdertype C(10) , ORderdesc C(50) , MAnager  C(20) , VAluelist M(4) , ID   I(4) 
		EndText
		Text to This.UpdatableFieldList noshow
		ID,ORDERNO,ORDERDATE,DEPARTNAME,SELLERNAME,SELLERTEL,RECEIVER,RECADDRESS,RECEIVERTEL,ORDERSTATE,ORDERTYPE,ORDERDESC,MANAGER 
		EndText
		Text to This.UpdateNameList noshow
		ORDERNO orders.ORDERNO,ORDERDATE orders.ORDERDATE,DEPARTNAME orders.DEPARTNAME,SELLERNAME orders.SELLERNAME,SELLERTEL orders.SELLERTEL,RECEIVER orders.RECEIVER,RECADDRESS orders.RECADDRESS,RECEIVERTEL orders.RECEIVERTEL,ORDERSTATE orders.ORDERSTATE,ORDERTYPE orders.ORDERTYPE,ORDERDESC orders.ORDERDESC,MANAGER orders.MANAGER,VALUELIST orders.VALUELIST,ID orders.ID
		EndText

    ENDPROC
    
	Procedure Init
	LPARAMETERS nCon,uId
	DoDefault(nCon)
    
    this.setupCA()  &&初始各个字段
	Endproc 

	Procedure New
		This.nRecno=recno(this.alias)
		this.add()
	Endproc

	Procedure Edit
		Lparameters cName
		this.nRecno=recno(this.alias)
	ENDPROC

	*--由子类实现
	Procedure Go
	Note:接收一个uId的参数,并刷新表内容 注意未决更新会导致刷新失败
	Lparameters uId
	
	Endproc
	
     
   *--勾子方法,删除之前执行
   Procedure OnBeforeDelete()
   Endproc

   *--勾子方法,删除之后执行
   Procedure OnAfterDelete()
   Endproc
    
    *--勾子方法,保存之后执行
	Procedure OnAfterSave
	Endproc

    *--勾子方法,保存之前执行
	Procedure OnBeforeSave
	Endproc

   Procedure OnAfterUndo()
   NOTE *--勾子方法,撤消之后执行
    select (this.alias)
    locate for this.nRecno=recno()
   Endproc

	Procedure FieldValid
    NOTE:勾子方法,定位到修改记录行,自行判断
	Endproc

PROCEDURE parsejson
      LPARAMETERS cJson,cRoot,naction,cKeylist
      LOCAL oReader,cField,nFieldState 
      oReader=Newobject("QiyuJsonReader","QiyuJsonReader.prg") &&JSON序列类
	  oReader.cursorstruct=this.CursorSchema
	  oReader.Alias=this.alias  &&临时表名
	  oReader.root=cRoot  &&JSON数组所在位置 目前只支持第一层	  
	  oReader.keylist=this.KeyFieldList &&主键字段所在位置	
	  oReader.parsecursor(cJson,naction) &&生成一个spaces表  
 
       IF !this.CursorAttach(this.alias,.t.)
          AERROR(laerror)
          this.msg=laerror(2)
          RETURN .f.
       ELSE
          RETURN .t.   
       endif 
    Endproc 
Enddefine