Define Class Dal_orders As Qiyu_CursorAdapter Of Locfile('Qiyu_CursorAdapter.fxp')
    *--����:���ӹ����ҡ�����:2020.02.28 http://www.tab163.com
	Alias = 'orders'
	WhereType =  1 && 1 �ؼ��ֶ� 2 �ؼ��ֶ�And�ɸ����ֶ�  3�ؼ��ֶμ��������޸ĵ��ֶ� 4 �ؼ��ֶ�Andʱ���
	KeyFieldList = "id"	
	Tables = "orders"
	oDAL=.F.
	nRecno=0	
	uId=.f.
	uOldId=.f.
	DataSourceType="ODBC"
	BufferModeOverride= 5  && 3 ����ʽ�л��� 5����ʽ����
	isUpdateDelcmd=.t. &&ִ��DELETE�������Ƿ��������º�̨���ݿ�
	FetchSize=-1
	
	
	
	
		
    PROCEDURE setupCA
    	Text to This.SelectCmd noshow
		select ID,ORDERDATE,ORDERNO,DEPARTNO,DEPARTNAME,SELLERNAME,SELLERTEL,RECEIVER,RECADDRESS,RECEIVERTEL,ORDERSTATE,ORDERTYPE,ORDERDESC from orders
		EndText
		Text to This.CursorSchema noshow
		 ID   I(4) , ORderdate D , ORderno  C(20) , DEpartno C(5) , DEpartname C(20) , SEllername C(20) , SEllertel C(12) , REceiver C(20) , REcaddress C(50) , REceivertel C(12) , ORderstate C(10) , ORdertype C(10) , ORderdesc C(50) 
		EndText
		Text to This.UpdatableFieldList noshow
		id,ORDERDATE,ORDERNO,DEPARTNO,DEPARTNAME,SELLERNAME,SELLERTEL,RECEIVER,RECADDRESS,RECEIVERTEL,ORDERSTATE,ORDERTYPE,ORDERDESC 
		EndText
		Text to This.UpdateNameList noshow
		ID orders.ID,ORDERDATE orders.ORDERDATE,ORDERNO orders.ORDERNO,DEPARTNO orders.DEPARTNO,DEPARTNAME orders.DEPARTNAME,SELLERNAME orders.SELLERNAME,SELLERTEL orders.SELLERTEL,RECEIVER orders.RECEIVER,RECADDRESS orders.RECADDRESS,RECEIVERTEL orders.RECEIVERTEL,ORDERSTATE orders.ORDERSTATE,ORDERTYPE orders.ORDERTYPE,ORDERDESC orders.ORDERDESC
		EndText

    ENDPROC
    
	Procedure Init
	LPARAMETERS nCon,uId
	DoDefault(nCon)
    
    this.setupCA()  &&��ʼ�����ֶ�
	Endproc 

	Procedure New
		This.nRecno=recno(this.alias)
		this.add()
	Endproc

	Procedure Edit
		Lparameters cName
		this.nRecno=recno(this.alias)
	ENDPROC

	*--������ʵ��
	Procedure Go
	Note:����һ��uId�Ĳ���,��ˢ�±����� ע��δ�����»ᵼ��ˢ��ʧ��
	Lparameters uId
	
	Endproc
	
     
   *--���ӷ���,ɾ��֮ǰִ��
   Procedure OnBeforeDelete()
   Endproc

   *--���ӷ���,ɾ��֮��ִ��
   Procedure OnAfterDelete()
   Endproc
    
    *--���ӷ���,����֮��ִ��
	Procedure OnAfterSave
	Endproc

    *--���ӷ���,����֮ǰִ��
	Procedure OnBeforeSave
	Endproc

   Procedure OnAfterUndo()
   NOTE *--���ӷ���,����֮��ִ��
    select (this.alias)
    locate for this.nRecno=recno()
   Endproc

	Procedure FieldValid
    NOTE:���ӷ���,��λ���޸ļ�¼��,�����ж�
	Endproc

PROCEDURE parsejson
      LPARAMETERS cJson,cRoot,naction,cKeylist
      LOCAL oReader,cField,nFieldState 
      oReader=Newobject("QiyuJsonReader","QiyuJsonReader.prg") &&JSON������
	  oReader.cursorstruct=this.CursorSchema
	  oReader.Alias=this.alias  &&��ʱ����
	  oReader.root=cRoot  &&JSON��������λ�� Ŀǰֻ֧�ֵ�һ��	  
	  oReader.keylist=this.KeyFieldList &&�����ֶ�����λ��	
	  oReader.parsecursor(cJson,naction) &&����һ��spaces��  
 
       IF !this.CursorAttach(this.alias,.t.)
          AERROR(laerror)
          this.msg=laerror(2)
          RETURN .f.
       ELSE
          RETURN .t.   
       endif 
    Endproc 
Enddefine