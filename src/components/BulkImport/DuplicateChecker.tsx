import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Users, RefreshCw, Plus, SkipForward } from 'lucide-react';

interface ExistingContact {
  id: string;
  email?: string;
  phone?: string;
  first_name: string;
  last_name?: string;
}

interface DuplicateMatch {
  importRow: any;
  importIndex: number;
  existingContact: ExistingContact;
  matchField: 'email' | 'phone';
  action: 'skip' | 'update' | 'create';
}

interface DuplicateCheckerProps {
  importData: any[];
  existingContacts: ExistingContact[];
  onResolved: (resolvedData: { toCreate: any[]; toUpdate: { id: string; data: any }[]; toSkip: number }) => void;
  onBack: () => void;
}

export function DuplicateChecker({
  importData,
  existingContacts,
  onResolved,
  onBack,
}: DuplicateCheckerProps) {
  // Find duplicates
  const { duplicates, newRecords } = useMemo(() => {
    const emailMap = new Map<string, ExistingContact>();
    const phoneMap = new Map<string, ExistingContact>();

    existingContacts.forEach(contact => {
      if (contact.email) {
        emailMap.set(contact.email.toLowerCase().trim(), contact);
      }
      if (contact.phone) {
        const normalizedPhone = contact.phone.replace(/\D/g, '');
        phoneMap.set(normalizedPhone, contact);
      }
    });

    const duplicatesFound: DuplicateMatch[] = [];
    const newRecordsFound: { data: any; index: number }[] = [];

    importData.forEach((row, index) => {
      let match: ExistingContact | undefined;
      let matchField: 'email' | 'phone' = 'email';

      // Check email first
      if (row.email) {
        match = emailMap.get(row.email.toLowerCase().trim());
        matchField = 'email';
      }

      // If no email match, check phone
      if (!match && row.phone) {
        const normalizedPhone = row.phone.replace(/\D/g, '');
        match = phoneMap.get(normalizedPhone);
        matchField = 'phone';
      }

      if (match) {
        duplicatesFound.push({
          importRow: row,
          importIndex: index,
          existingContact: match,
          matchField,
          action: 'update', // Default action
        });
      } else {
        newRecordsFound.push({ data: row, index });
      }
    });

    return { duplicates: duplicatesFound, newRecords: newRecordsFound };
  }, [importData, existingContacts]);

  const [duplicateActions, setDuplicateActions] = useState<Record<number, 'skip' | 'update' | 'create'>>(
    () => duplicates.reduce((acc, dup) => ({ ...acc, [dup.importIndex]: 'update' }), {})
  );

  const updateAction = (index: number, action: 'skip' | 'update' | 'create') => {
    setDuplicateActions(prev => ({ ...prev, [index]: action }));
  };

  const setAllActions = (action: 'skip' | 'update' | 'create') => {
    setDuplicateActions(
      duplicates.reduce((acc, dup) => ({ ...acc, [dup.importIndex]: action }), {})
    );
  };

  const handleContinue = () => {
    const toCreate = newRecords.map(r => r.data);
    const toUpdate: { id: string; data: any }[] = [];
    let toSkip = 0;

    duplicates.forEach(dup => {
      const action = duplicateActions[dup.importIndex];
      if (action === 'skip') {
        toSkip++;
      } else if (action === 'update') {
        toUpdate.push({
          id: dup.existingContact.id,
          data: dup.importRow,
        });
      } else if (action === 'create') {
        toCreate.push(dup.importRow);
      }
    });

    onResolved({ toCreate, toUpdate, toSkip });
  };

  const summary = useMemo(() => {
    let skipCount = 0;
    let updateCount = 0;
    let createFromDuplicates = 0;

    duplicates.forEach(dup => {
      const action = duplicateActions[dup.importIndex];
      if (action === 'skip') skipCount++;
      else if (action === 'update') updateCount++;
      else if (action === 'create') createFromDuplicates++;
    });

    return {
      total: importData.length,
      new: newRecords.length,
      duplicates: duplicates.length,
      willCreate: newRecords.length + createFromDuplicates,
      willUpdate: updateCount,
      willSkip: skipCount,
    };
  }, [importData, newRecords, duplicates, duplicateActions]);

  if (duplicates.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Users className="h-5 w-5" />
            לא נמצאו כפילויות!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 mb-4">
            כל {importData.length} הרשומות הן חדשות ויתווספו למערכת.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              חזרה
            </Button>
            <Button onClick={() => onResolved({ toCreate: importData, toUpdate: [], toSkip: 0 })} className="btn-premium">
              המשך לייבוא
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Warning Header */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            נמצאו {duplicates.length} כפילויות פוטנציאליות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-600 text-sm mb-4">
            הרשומות הבאות כבר קיימות במערכת (לפי אימייל או טלפון). בחר מה לעשות עם כל אחת:
          </p>
          
          {/* Summary Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-white">
              סה"כ לייבוא: {summary.total}
            </Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <Plus className="h-3 w-3 mr-1" />
              ייווצרו: {summary.willCreate}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              <RefreshCw className="h-3 w-3 mr-1" />
              יעודכנו: {summary.willUpdate}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
              <SkipForward className="h-3 w-3 mr-1" />
              ידולגו: {summary.willSkip}
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAllActions('update')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              עדכן הכל
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAllActions('skip')}
            >
              <SkipForward className="h-3 w-3 mr-1" />
              דלג על הכל
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAllActions('create')}
            >
              <Plus className="h-3 w-3 mr-1" />
              צור הכל כחדשים
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Duplicates Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">רשימת כפילויות</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-[180px]">נתון מהקובץ</TableHead>
                  <TableHead className="text-right w-[180px]">קיים במערכת</TableHead>
                  <TableHead className="text-right w-[100px]">התאמה לפי</TableHead>
                  <TableHead className="text-right">פעולה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicates.map((dup) => (
                  <TableRow key={dup.importIndex}>
                    <TableCell>
                      <div className="font-medium">{dup.importRow.first_name} {dup.importRow.last_name || ''}</div>
                      <div className="text-xs text-muted-foreground">
                        {dup.importRow.email || dup.importRow.phone || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{dup.existingContact.first_name} {dup.existingContact.last_name || ''}</div>
                      <div className="text-xs text-muted-foreground">
                        {dup.existingContact.email || dup.existingContact.phone || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {dup.matchField === 'email' ? '📧 אימייל' : '📱 טלפון'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={duplicateActions[dup.importIndex] === 'update' ? 'default' : 'outline'}
                          className="h-7 text-xs"
                          onClick={() => updateAction(dup.importIndex, 'update')}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={duplicateActions[dup.importIndex] === 'skip' ? 'default' : 'outline'}
                          className="h-7 text-xs"
                          onClick={() => updateAction(dup.importIndex, 'skip')}
                        >
                          <SkipForward className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={duplicateActions[dup.importIndex] === 'create' ? 'default' : 'outline'}
                          className="h-7 text-xs"
                          onClick={() => updateAction(dup.importIndex, 'create')}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* New Records Summary */}
      {newRecords.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-green-700">
              <Plus className="h-4 w-4" />
              <span className="font-medium">{newRecords.length} רשומות חדשות</span>
              <span className="text-sm text-green-600">יתווספו אוטומטית</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          חזרה
        </Button>
        <Button onClick={handleContinue} className="btn-premium">
          המשך לייבוא ({summary.willCreate + summary.willUpdate} רשומות)
        </Button>
      </div>
    </div>
  );
}
