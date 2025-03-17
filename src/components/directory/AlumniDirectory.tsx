
import { useState } from 'react';
import { Briefcase, MapPin, GraduationCap, MessageCircle, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AlumniDirectoryProps {
  alumni: any[];
  onConnectClick: (alumni: any) => void;
  onMessageClick: (alumni: any) => void;
}

const AlumniDirectory = ({ alumni, onConnectClick, onMessageClick }: AlumniDirectoryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alumni.length > 0 ? (
        alumni.map((alumni) => (
          <Card key={alumni.id} className="overflow-hidden glass-card border-none hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={alumni.photo}
                    alt={alumni.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{alumni.name}</h3>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <Briefcase className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      {alumni.role} at {alumni.company}
                    </p>
                    <p className="text-muted-foreground text-sm flex items-center mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      {alumni.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  <span>Class of {alumni.batch}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {alumni.domains.map((domain: string) => (
                    <span
                      key={domain}
                      className="bg-primary/10 text-primary text-xs rounded-full px-2.5 py-0.5"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-2 border-t border-border p-4 flex justify-between items-center">
                <span className={`flex items-center text-xs ${alumni.available ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${alumni.available ? 'bg-green-600' : 'bg-muted-foreground'}`}></span>
                  {alumni.available ? 'Available for mentoring' : 'Not available now'}
                </span>
                
                {alumni.connectionStatus === 'none' && (
                  <Button 
                    variant="default" 
                    className="gap-1.5"
                    onClick={() => onConnectClick(alumni)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Connect
                  </Button>
                )}
                
                {alumni.connectionStatus === 'pending' && (
                  <Button variant="outline" disabled className="gap-1.5">
                    <Check className="h-4 w-4" />
                    Request Sent
                  </Button>
                )}
                
                {alumni.connectionStatus === 'connected' && (
                  <Button 
                    variant="default" 
                    className="gap-1.5"
                    onClick={() => onMessageClick(alumni)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No alumni found matching your search.
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
