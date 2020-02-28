Define Class Dal_orderdetail As Qiyu_CursorAdapter Of Locfile('Qiyu_CursorAdapter.fxp')
    *--����:���ӹ����ҡ�����:2020.02.28 http://www.tab163.com
	Alias = 'orderdetail'
	WhereType =  1 && 1 �ؼ��ֶ� 2 �ؼ��ֶ�And�ɸ����ֶ�  3�ؼ��ֶμ��������޸ĵ��ֶ� 4 �ؼ��ֶ�Andʱ���
	KeyFieldList = "id"	
	Tables = "orderdetail"
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
		select ID,ORDERNO,ITEMNO,COLOR,SIZE,NUM,PRICE,OTHERMSG from orderdetail
		EndText
		Text to This.CursorSchema noshow
		 ID   I(4) , ORderno  C(20) , ITemno  C(15) , COlor  C(10) , SIze  C(10) , NUm   I(4) , PRice  N(8,2) , OThermsg C(20) 
		EndText
		Text to This.UpdatableFieldList noshow
		id,ORDERNO,ITEMNO,COLOR,SIZE,NUM,PRICE,OTHERMSG 
		EndText
		Text to This.UpdateNameList noshow
		ID orderdetail.ID,ORDERNO orderdetail.ORDERNO,ITEMNO orderdetail.ITEMNO,COLOR orderdetail.COLOR,SIZE orderdetail.SIZE,NUM orderdetail.NUM,PRICE orderdetail.PRICE,OTHERMSG orderdetail.OTHERMSG
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