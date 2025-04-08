import React from 'react';
import { Form, Input, Button, Flex, Modal, Select, Space } from 'antd';
import useForm from '@app/admin-ui/hooks';
import { trpc } from '@app/admin-ui/trpc/trpc-client';

import {
  createCountrySchema,
  CreateCountrySchemaType,
} from '@ethio-tutora/shared';
import { countryEmojis, getFlagEmoji } from '@app/admin-ui/utils';

type RegisterPageProps = {
  id: number | undefined; // id -
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

export default function RegisterPage({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: RegisterPageProps) {
  const trpcContext = trpc.useUtils();
  // const [mode, setMode] = React.useState<'create' | 'edit'>('create');
  const { formField, inputField } = useForm<CreateCountrySchemaType>({
    schema: createCountrySchema,
    onSubmit: (data, error) => {
      console.log(data, error);
      if (!data) return;

      if (id) {
        updateCountryMutation.mutate({
          res: { id: id, ...data, icon: getFlagEmoji(data.shortName) },
        });
      } else {
        createCountryMutation.mutate({
          ...data,
          icon: getFlagEmoji(data.shortName),
        } as CreateCountrySchemaType);
      }
    },
  });

  const createCountryMutation = trpc.countries.create.useMutation({
    onSuccess() {
      trpcContext.countries.findAll.invalidate();
      // close the modal
      onSubmit(true);
    },
    onSettled(data, error, variables, context) {
      console.log('onSettled', data, error, variables, context);
      // reset the form
      formField.form.resetFields();
    },
  });
  const updateCountryMutation = trpc.countries.update.useMutation({
    onSuccess() {
      trpcContext.countries.findAll.invalidate();
      formField.form.resetFields();
      // close the modal
      onSubmit(true);
    },
    onSettled(data, error, variables, context) {
      console.log('onSettled', data, error, variables, context);
    },
  });
  const findOneCountryQuery = trpc.countries.findOne.useQuery(
    { id: id! },
    {
      enabled: !!id,
    },
  );

  React.useEffect(() => {
    if (id) {
      formField.form.setFieldsValue(
        findOneCountryQuery.data as CreateCountrySchemaType,
      );
    } else {
      formField.form.resetFields();
    }
  }, [findOneCountryQuery.data]);

  return (
    <Modal
      title={id ? 'Edit Country' : 'Add Country'}
      open={isModalOpen}
      footer={''}
      onOk={handleOk} // hidden, but required
      onCancel={handleCancel} // hidden, but required
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <Form
        name="addCountry"
        {...formField}
        form={formField.form}
        layout="vertical"
      >
        <Form.Item {...inputField} name="countryName" label="Country Name">
          <Input placeholder="Please input your country name" />
        </Form.Item>

        <Form.Item {...inputField} name="shortName" label="Short Name">
          <Select
            showSearch
            onClear={() => {}}
            style={{ width: '100%' }}
            placeholder="select one country"
            // onChange={handleChange}
            options={Object.entries(countryEmojis).map(
              ([countryCode, countryEmoji]) => {
                return {
                  label: `${countryEmoji} ${countryCode}`,
                  value: countryCode,
                  emoji: countryEmoji,
                  desc: countryCode,
                  data: { emoji: countryEmoji, desc: countryCode },
                };
              },
            )}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {option.data.emoji}
                </span>
                {option.data.desc}
              </Space>
            )}
          />
        </Form.Item>

        <Form.Item {...inputField} name="phonePrefix" label="Phone Prefix">
          <Input placeholder="Please input phone prefix" />
        </Form.Item>

        <Flex justify="center">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {id ? 'Update' : 'Save'}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
}
