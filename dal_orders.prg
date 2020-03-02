Define Class Dal_orders As Qiyu_CursorAdapter Of Locfile('Qiyu_CursorAdapter.fxp')
    *--����:���ӹ����ҡ�����:2020.03.02 http://www.tab163.com
	Alias = 'orders'
	WhereType =  1 && 1 �ؼ��ֶ� 2 �ؼ��ֶ�And�ɸ����ֶ�  3�ؼ��ֶμ��������޸ĵ��ֶ� 4 �ؼ��ֶ�Andʱ���
	KeyFieldList = "ID"	
	Tables = "orders"
	oDAL=.F.
	nRecno=0	
	uId=.f.
	uOldId=.f.
	DataSourceType="ODBC"
	BufferModeOverride= 5  && 3 ����ʽ�л��� 5����ʽ����
	isUpdateDelcmd=.t. &&ִ��DELETE�������Ƿ��������º�̨���ݿ�
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