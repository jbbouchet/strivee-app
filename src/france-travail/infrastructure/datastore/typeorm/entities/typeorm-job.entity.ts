import { Job } from '@strivee-api/france-travail/domain';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'france_travail_job' })
export class TypeormJobEntity implements Job {
  /**
   * The unique job identifier
   */
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /**
   * @inheritDoc
   */
  @Column('citext')
  public label: string;

  /**
   * @inheritDoc
   */
  @Column('varchar')
  public code: string;
}
